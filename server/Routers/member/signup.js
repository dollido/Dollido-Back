import { Router } from "express";
import queryGet from "../../modules/db_connect";
import memberQuery from "../../query/member";
import encryption from "./encryption";

const router = Router();

const nickCheck = async (user_nick) => {
    const [result] = await queryGet(memberQuery.findByNickCnt, user_nick);
    return (result.cnt == 0) ? true : false;
}

const idCheck = async (user_id) => {
    const [result] = await queryGet(memberQuery.findByIdCnt, user_id);
    return (result.cnt == 0) ? true : false;
}

const handleValidate = (user_id, user_pw, user_nick) => {
    let bool = true;
    let msg = '합격';

    if(user_nick == "" || user_nick == undefined) {
        bool = false;
        msg = '닉네임을 입력해주세요';
    } else if(user_id == "" || user_id == undefined) {
        bool = false;
        msg = '아이디를 입력해주세요';
    } else if(user_pw == "" || user_pw == undefined) {
        bool = false;
        msg = '비밀번호를 입력해주세요';
    }

    return {bool: bool, msg: msg};
}

router.post("/nickCheck", async(req, res) => {
    let user_nick = req.body.user_nick;
    let bool = true;
    let msg = "사용가능한 닉네임 입니다";
    try {
        if(user_id == "" || user_id == undefined) {
            bool = false;
            msg = "닉네임을 입력해주세요";
        } else if(!await nickCheck(user_nick)) {
            bool = false;
            msg = "중복된 닉네임 입니다";
        }
    
        res.status(200).send({bool: bool, msg: msg});
    } catch(e) {
        console.log(e);
    }
});

router.post("/idCheck", async(req, res) => {
    let user_id = req.body.user_id;
    let bool = true;
    let msg = "사용가능한 아이디 입니다";

    try {
        if(user_id == "" || user_id == undefined) {
            bool = false;
            msg = "아이디를 입력해주세요";
        } else if(!await idCheck(user_id)) {
            bool = false;
            msg = "중복된 아이디 입니다";
        }
    
        res.status(200).send({bool: bool, msg: msg});
    } catch(e) {
        console.log(e);
    }
});

router.post("/", async (req, res) => {
    let { user_id, user_pw, user_nick } = req.body;
    let validate = handleValidate(user_id, user_pw, user_nick);
    let bool = validate.bool;
    let msg = validate.msg;
    let status = 200;

    if(bool) {
        try {
            let nick_check = await nickCheck(user_nick);
            let id_check = await idCheck(user_id);
            if (nick_check) {
                if (id_check) {
                    let { password, salt } = await encryption(user_pw, 0);
                    let args = [user_id, password, user_nick, salt];
                    await queryGet(memberQuery.insertMember, args);
                    status = 201;
                    bool = true;
                    msg = "회원가입 성공";
                } else {
                    bool = false;
                    msg = "중복된 아이디 입니다";
                }
            } else {
                bool = false;
                msg = "중복된 닉네임 입니다";
            }
        } catch {
            res.status(status).send({bool: false, msg: "오류"});
            return;
        }
    }

    res.status(status).send({bool: bool, msg: msg});
});

module.exports = router;