import express from "express";
import multer from "multer";
import fs from "fs";
import { rooms } from "../socket/socket";
import authUtil from "../member/auth";
import { uploadFile, deleteObject } from "../../s3";
import queryGet from "../../modules/db_connect";
import bestVideoQuery from "../../query/bestVideo";
import { bestVideos } from "./bestPerformerFuncs";

const destPath = 'uploads/'
const uploadPath = __dirname + '/../../../' + destPath;

const router = express.Router();
const upload = multer({ dest: destPath });

function getNowTime() {
    let now = new Date();
    now.setHours(now.getHours() + 9); // 한국 시간으로 세팅
    const date = now.toLocaleString().split(',')[0].replace('/', '').replace('/', '');
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()].join('');
    const nowTime = `${date}_${time}`;

    return nowTime;
}

/** 유저가 자신의 웃는 영상(videoFile)을 user_nick와 함께 보내면 이를 저장하고 bestVideoPath에 보관 */
router.post('/send-video', upload.single("video"), authUtil, async (req, res) => {
    const user_nick = req.body.user_nick;
    const videoFile = req.file;
    videoFile.originalname = `_${user_nick}.mp4`;
    
    const uploadRes = await uploadFile(videoFile, 'bestVideos/'); // Upload to S3
    console.log("Upload Location :", uploadRes.Location);
    
    const videoPath = `${uploadPath}/${videoFile.filename}`;
    fs.unlink(videoPath, (err) => {    // Delete local video file
        if (err) console.log(err);
    });
    
    const nowTime = getNowTime();
    const newVideoName = `${user_nick}-${nowTime}.mp4`;
    
    // Insert Video Info into MySQL DB
    const member_id = req.idx;
    const args = [member_id, newVideoName, uploadRes.key];
    if (!await queryGet(bestVideoQuery.insertVideo, args)) { // 실패하면
        deleteObject(uploadRes.key);                         // s3에서 삭제
    }

    console.log(`${user_nick} video uploaded. size : ${videoFile.size}`);

    bestVideos[user_nick] = uploadRes.key;    // bestVideos에 등록

    res.status(201).send({ success: true, msg: "파일이 성공적으로 전송되었습니다." });
});


/** best performer의 id와 비디오 이름 던져줌 */
router.post("/get-video", (req, res) => {
    const room = rooms[req.body.roomID];

    if (room === undefined) {
        res.status(404).send({ msg: `존재하지 않는 방입니다. roomID : ${req.body.roomID}` });
        return;
    }

    const bestPerformerNick = room.bestPerformer;
    if (bestPerformerNick == null) {
        res.status(404).send({ msg: "best performer가 지정되지 않았습니다." });
    } else {
        const bestVideoName = bestVideos[bestPerformerNick];
        console.log('Best Video Name :', bestVideoName);
        res.send({ bestPerformerNick: bestPerformerNick, bestVideoName: bestVideoName });
    }
});


module.exports = router;