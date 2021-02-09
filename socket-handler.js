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


}