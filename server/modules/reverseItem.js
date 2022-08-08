// HP가 가장 낮은 유저의 socketID를 리턴
const chooseReverseUser = (rooms, roomID) => {
    let untilMinHP = 10**6;
    let choosenUser = "anonymous";
    if (rooms && roomID && rooms[roomID]) {
        for (const member of rooms[roomID].members) {
            if (member.HP < untilMinHP) {
                untilMinHP = member.HP;
                choosenUser = member.socketID;
            }
        }
    }

    return choosenUser;
}

module.exports.chooseReverseUser = chooseReverseUser;