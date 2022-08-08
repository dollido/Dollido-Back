const defaultUserNick = "anonymous";
const bestVideos = {}; // user_nick에 대한 비디오 이름이 저장됨

/** best performer 결정
 * 정책 : 가장 HP가 낮은 사람 */
 function chooseBestPerformer(rooms, roomID) {
    let untilMinHP = 10**6;
    let bestPerformer = defaultUserNick;
    for (const member of rooms[roomID].members) {
        if (member.HP < untilMinHP) {
            untilMinHP = member.HP;
            bestPerformer = member.nickName;
        }
    }
    return bestPerformer;
}

/** 유저 비디오 캐시 삭제 */
function deleteVideoCache(room) {
    for (const member of room.members) {
        const user_nick = member.nickName;
        delete bestVideos[user_nick]; // 이전 영상 cache 삭제
    }
}

exports.bestVideos = bestVideos;
exports.chooseBestPerformer = chooseBestPerformer;
exports.deleteVideoCache = deleteVideoCache;