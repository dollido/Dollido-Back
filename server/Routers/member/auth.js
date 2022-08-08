import jwt from "../../modules/jwt";

const authUtil = async (req, res, next) => {
    var token = req.headers.token;
    // 토큰 없음
    if (!token) 
        return res.status(400).send({bool:false, msg: "토큰이 없습니다"});
    
    const user = await jwt.verify(token);
    // 유효기간 만료
    if (user === -3) 
        return res.status(400).send({bool:false, msg: "토큰의 유효기간이 만료 되었습니다"});
        
    // 유효하지 않는 토큰
    if (user === -2 || user.idx === undefined) 
        return res.status(400).send({bool:false, msg: "유효하지 않은 토큰입니다"});
    
    req.idx = user.idx;
    next();
}

module.exports = authUtil;