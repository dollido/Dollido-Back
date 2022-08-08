// database
module.exports = {
    insertCF: "INSERT INTO changable_factors (member_id, point, win, lose, ranking, tier) VALUES(?, ?, ?, ?, ?, ?)",
    getCF: "SELECT point, win, lose, ranking, tier FROM changable_factors WHERE member_id=?",
    updateCFById: "UPDATE changable_factors SET point=?, win=?, lose=?, ranking=?, tier=? WHERE member_id=?",
    rank: "SELECT * FROM(select member_id, win, lose, ranking, rank() OVER(ORDER BY win DESC) AS 'rank' FROM changable_factors) ranked WHERE ranked.member_id=?",
    findCnt: "SELECT COUNT(*) AS cnt FROM changable_factors",
}