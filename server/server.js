import http from "http";
import cors from "cors";
import express from "express";
import { socketOn } from "./Routers/socket/socket";
// routers import
import apiGifs from "./Routers/gifs";
import apiSignUp from "./Routers/member/signup";
import apiSignIn from "./Routers/member/signin";
import apiBestPerformer from "./Routers/bestPerformer/bestPerformer";

const port = 5000;
const app = express();
const server = http.createServer(app);

// 기본 설정 (cors, 접근할 수 있는 경로)
app.use(cors());
app.use(express.json()); // 이거 넣어줘야 post에서 데이터 받을 수 있다규..ㅠ
app.use(express.static('./server/public'));
app.use(express.static('./server/bestVideos'));
app.use(express.urlencoded({ extended: false })); // app을 통해 들어오는 모든 요청은 bodyParser라는 미들웨어를 거쳐 라우트로 전달

// routers
app.use("/api/gifs", apiGifs);
app.use("/api/user/signup", apiSignUp);
app.use("/api/user/signin", apiSignIn);
app.use("/api/best", apiBestPerformer);



// webSocket, https 연결
socketOn(server);
server.listen(port, () => console.log("접속 완료"));