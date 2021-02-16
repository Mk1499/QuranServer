export const socketHandler = (socket) => {


    socket.on("student-join-room", (roomID, studentID, studentName) => {
        console.log("new student ", studentID, "connected to room : ", roomID);
        socket.join(roomID);
        socket.to(roomID).broadcast.emit("new-student", studentID, studentName);
    });

    socket.on("lecture-teacher-id", (teacherID, roomID) => {
        console.log("lecture-teacher-id : ", teacherID);
        socket.to(roomID).broadcast.emit("define-teacher-id", teacherID);
    });

    socket.on("teacher-join-room", (roomID, teacherID) => {
        socket.join(roomID);
        socket.to(roomID).broadcast.emit("new-teacher", teacherID);
    });

    socket.on("student-quite", (streamID, roomID) => {
        socket.to(roomID).broadcast.emit("remove-stream", streamID);
    })

    socket.on("finish-lecture", (roomID) => {
        socket.to(roomID).broadcast.emit("lecture-finished")
    })

    socket.on("teacherChangeAya", (roomID, chagedAya) => {
        socket.to(roomID).broadcast.emit("newAya", chagedAya)
    })



    socket.on("teacherJoin", (lectureID, teacherID) => {
        socket.join(lectureID);
        socket.to(lectureID).broadcast.emit("teacherJoined", teacherID)
    })


    socket.on("studentJoin", (lectureID, studentID) => {
        socket.join(lectureID);
        socket.to(lectureID).broadcast.emit("studentJoined", studentID)
    })


    socket.on("bcStudentPeerID", (lectureID, studentID, avatar) => {
        socket.to(lectureID).broadcast.emit("studentPeerID", studentID, avatar)
    })

    socket.on("bcTeacherPeerID", (lectureID, teacherID, avatar) => {
        socket.to(lectureID).broadcast.emit("teacherPeerID", teacherID, avatar)
    })

    socket.on("sendMessage", (lectureID, msgContent, senderName) => {
        socket.to(lectureID).broadcast.emit("newMsg", msgContent, senderName)
    })


}