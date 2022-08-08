// database
module.exports = {
    findById: "SELECT inventory_id FROM inventory WHERE member_id=?",
    findImageById: "SELECT image_id FROM inventory WHERE member_id=?",
    insertInventory: "INSERT INTO inventory (member_id, image_id) VALUES(?, ?)",
    updateInventory: "UPDATE inventory SET image_id=? WHERE member_id=?",
}