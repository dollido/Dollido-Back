// database
module.exports = {
    insertGif: "INSERT INTO image (member_id, laughing_cnt, image_orgin, image_server) VALUES(?, ?, ?, ?)",
    findImageIdByImageServer: "SELECT image_id FROM image WHERE image_server=?",
    findImageById: "SELECT image_server FROM image WHERE image_id=?"
}