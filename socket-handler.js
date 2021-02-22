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
  });

  socket.on("finish-lecture", (roomID) => {
    socket.to(roomID).broadcast.emit("lecture-finished");
  });

  socket.on("teacherChangeAya", (roomID, chagedAya) => {
    socket.to(roomID).broadcast.emit("newAya", chagedAya);
  });

  // Phase #2

  socket.on("teacherJoin", (lectureID, teacherID, userName, avatar) => {
    console.log(
      "New Teacher with id : ",
      teacherID,
      "and name : ",
      userName,
      " Join : ",
      lectureID
    );
    socket.join(lectureID);
    socket.to(lectureID).broadcast.emit("teacherJoined", teacherID);
  });

  socket.on("studentJoin", (lectureID, studentID, userName, avatar) => {
    console.log(
      "New Student with id : ",
      studentID,
      "and Name : ",
      userName,
      " Join : ",
      lectureID
    );

    socket.join(lectureID);
    socket.to(lectureID).broadcast.emit("studentJoined", studentID);
  });

  socket.on("bcStudentPeerID", (lectureID, studentID, avatar) => {
    socket.to(lectureID).broadcast.emit("studentPeerID", studentID, avatar);
  });

  socket.on("bcTeacherPeerID", (lectureID, teacherID, avatar) => {
    socket.to(lectureID).broadcast.emit("teacherPeerID", teacherID, avatar);
  });

  socket.on("sendMessage", (lectureID, msgContent, senderName) => {
    socket.to(lectureID).broadcast.emit("newMsg", msgContent, senderName);
  });

  socket.on("adminConnected", (lectureID, adminID) => {
    socket.join(lectureID);
    socket.to(lectureID).broadcast.emit("adminConnected", adminID);
  });

  socket.on("bcAdminPeerID", (lectureID, adminID) => {
    socket.to(lectureID).broadcast.emit("adminPeerID", adminID);
  });
};
