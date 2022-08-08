// 방 만들기 handle
const handleMakeRoom = (roomName, roomID, maxCnt) => {
    let msg = "";
    let bool = false;

    if (roomName === "" || !roomName || roomID === "" || !roomID ) {
        msg = "방 이름을 작성해 주세요";
    } else if (maxCnt <= 0) {
        msg = "방 인원을 최소 1명 이상이여야 됩니다";
    } else if (maxCnt >= 4) {
        msg = "방 인원은 최대 4명 입니다";
    } else {
        msg = "성공";
        bool = true;
    }

    return {msg: msg, bool: bool};
}

// 방 참여 handle
const handleJoinRoom = (roomID, streamID, nickName, room) => {
    let msg = "";
    let bool = false;

    if (!room || roomID === "" || !roomID) {
        msg = "해당 방이 없습니다";
    } else if (streamID === "" || !streamID) {
        msg = "영상을 허용해주세요";
    } else if (nickName === "" || !nickName) {
        msg = "로그인 후 이용가능합니다";
    } else if (room.count >= 4) {
        msg = "현재 방에 인원이 꽉 찼습니다";
    } else if (room.isPlay) {
        msg = "이미 게임 중입니다";
    } else {
        msg = "성공";
        bool = true;
    }

    return {msg: msg, bool: bool};
}

// 게임 종료 handle
const handleFinish = (roomID, room) => {
    let msg = "";
    let bool = false;
    
    if (!room || roomID === "" || !roomID) {
        msg = "해당 방이 없습니다";
    } else {
        msg = "성공";
        bool = true;
    }

    return {msg: msg, bool: bool};
}

const handleWait = (roomID, room) => {
    let msg = "";
    let bool = false;

    if (!room || roomID === "" || !roomID) {
        msg = "해당 방이 없습니다";
    } else if (room.members.length === 0) {
        msg = "방에 아무도 없습니다";
    } else {
        msg = "성공";
        bool = true;
    }

    return {msg: msg, bool: bool};
}

const handleStart = (roomID, room) => {
    let msg = "";
    let bool = false;

    if (!room || roomID === "" || !roomID) {
        msg = "해당 방이 없습니다";
    } else if (room.count == undefined || room.count == null) {
        msg = "방에 아무도 없습니다";
    } else if (room.readyCount == undefined || room.readyCount == null) {
        msg = "방에 레디한 인원이 없습니다";
    } else {
        msg = "성공";
        bool = true;
    }

    return {msg: msg, bool: bool};
}

const handleReady = (roomID, room) => {
    let msg = "";
    let bool = false;
    
    if (!room || roomID === "" || !roomID) {
        msg = "해당 방이 없습니다";
    } else if (room.count == undefined || room.count == null) {
        msg = "방에 아무도 없습니다";
    } else if (room.readyCount == undefined || room.readyCount == null) {
        msg = "방에 레디한 인원이 없습니다";
    } else {
        msg = "성공";
        bool = true;
    }
    
    return {msg: msg, bool: bool};
}

const handleOutRoom = (socket, rooms, io) => {
    let theID = "";
    Object.entries(rooms).forEach((room) => {
        let nickname = "";
        let exUserStreamID = "";
        let bool = false;
        let readyBool = false;
        // 나머지 인원에게 나간 사람 정보 broadcast
        let chiefCheck = false;
        const newRoomMembers = room[1].members.filter((v) => {
            if (v.socketID === socket.id) {
                bool = true;
                readyBool = v.isReady;
                theID = room[0];
                nickname = v.nickName;
                exUserStreamID = v.streamID;
                if(v.streamID === room[1].chief.streamID){
                    chiefCheck = true;
                }
                io.to(theID).emit("out user", {
                    streamID: exUserStreamID
                });
            }
            const messageData = {
                room: theID,
                author: 'system',
                message: `${nickname} 님이 퇴장했습니다`,
            }
            io.to(theID).emit("onDisconnect", messageData);
            
            socket.leave(theID);
            if (v.socketID !== socket.id) {
            return v;
            }
        });
        // rooms의 정보 갱신
        if (bool) {
            if (readyBool) {
                room[1].readyCount -= 1
            };
            
            room[1].count -= 1
        }
        room[1].members = newRoomMembers;

        if(chiefCheck && room[1].members[0] && room[1].members[0].isReady)
        {
            room[1].readyCount -= 1
        }

    });
    if (rooms[theID] && rooms[theID].count > 0) {
        const chief = rooms[theID].members[0].streamID;
        io.to(theID).emit("chief", {chiefStream: chief});
    } else if (rooms[theID] && rooms[theID].count == 0) {
        delete rooms[theID];
    }
    io.to(theID).emit("give room list", rooms);
}

module.exports = {
    handleMakeRoom,
    handleJoinRoom,
    handleFinish,
    handleWait,
    handleStart,
    handleReady,
    handleOutRoom
}