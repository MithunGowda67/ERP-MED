/**
 * Examination Module Logic
 */
const registerForExam = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { examRef, studentId } = req.body;

    // Middleware already ensures roles, here we enforce business logic:
    // A student cannot register for exams and get a hall ticket if they have pending fees.
    const demandsSnapshot = await db
      .collection('students')
      .doc(studentId)
      .collection('feeDemands')
      .where('status', 'in', ['PENDING', 'PARTIAL'])
      .get();
      
    if (!demandsSnapshot.empty) {
      return res.status(403).json({ 
        message: 'Registration blocked due to outstanding fee demands. Please clear your dues.' 
      });
    }

    // Since fees are clear, process the registration
    const newReg = await db.collection('examRegistrations').add({
      studentRef: studentId,
      examRef,
      feeClearanceStatus: 'CLEARED',
      hallTicketUrl: `https://storage.provider/erp/halltickets/generated-${studentId}-${examRef}.pdf`,
      registeredAt: new Date().toISOString()
    });

    res.status(201).json({ 
      message: 'Successfully registered for examination', 
      hallTicketUrl: newReg.hallTicketUrl 
    });
  } catch (error) {
    console.error('Exam registration error:', error);
    res.status(500).json({ message: 'Internal server error while registering for exam' });
  }
};

const publishResults = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { examRef, resultsData } = req.body; 
    // resultsData = [{ studentRef: '...', marks: 85, grade: 'A' }]

    // Batch write to handle result publishing natively without dropping any writes
    const batch = db.batch();
    
    resultsData.forEach(result => {
      const resultDocRef = db.collection('results').doc();
      batch.set(resultDocRef, {
        examRef,
        studentRef: result.studentRef,
        marks: result.marks,
        grade: result.grade,
        published: true,
        publishedAt: new Date().toISOString()
      });
    });

    await batch.commit();

    res.status(201).json({ message: `Successfully published ${resultsData.length} records.` });
  } catch (error) {
    console.error('Publish results error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerForExam, publishResults };
