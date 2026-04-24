const createSession = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { subjectRef, date, batch, startTime, endTime } = req.body;
    
    const newSession = await db.collection('sessions').add({
      subjectRef,
      facultyRef: req.user.linkedId, // Current logged-in staff member
      date,
      batch,
      startTime,
      endTime
    });
    
    res.status(201).json({ message: 'Session created', sessionId: newSession.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const markAttendance = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { sessionId } = req.params;
    const { date, subjectRef, attendanceRecords } = req.body; 
    // attendanceRecords = [{ studentId: '...', status: 'present'|'absent' }]

    // 1. Create/Get Attendance header
    const attendanceDocRef = db.collection('attendance').doc(sessionId);
    await attendanceDocRef.set({
      sessionRef: sessionId,
      date,
      subjectRef,
      markedBy: req.user.linkedId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 2. Batch write to the subcollection for robust scaling
    const batch = db.batch();
    
    attendanceRecords.forEach(record => {
      const recordRef = attendanceDocRef.collection('attendanceRecords').doc(record.studentId);
      batch.set(recordRef, {
        status: record.status,
        markedAt: new Date().toISOString()
      }, { merge: true }); // handle updates gracefully
    });
    
    await batch.commit();

    res.status(200).json({ message: 'Attendance marked successfully via scalable subcollections' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createSession, markAttendance };
