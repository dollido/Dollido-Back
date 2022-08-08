// database
module.exports = {
    findByMemberId: "SELECT member_id FROM members WHERE user_id=?",
    findByIdCnt: "SELECT COUNT(*) AS cnt FROM members WHERE user_id=?",
    findByNickCnt: "SELECT COUNT(*) AS cnt FROM members WHERE nick_name=?",
    findBySalt: "SELECT salt FROM members WHERE user_id=?",
    insertMember: "INSERT INTO members (user_id, password, nick_name, salt) VALUES(?, ?, ?, ?)",
    login: "SELECT * FROM members WHERE user_id=? AND password=?",
    findMemberIdByNickname: "SELECT member_id FROM members WHERE nick_name=?",
}