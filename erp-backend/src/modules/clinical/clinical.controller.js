const submitClinicalLog = async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Privacy Focused: CaseId replaces PatientId entirely avoiding regulated PII payloading.
    const { department, caseType, verifiedBy, clinicalNotes, caseId } = req.body;
    
    // Only students should submit their own logs in this flow
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit clinical logs' });
    }

    const newLog = await db.collection('clinicalLogs').add({
      studentId: req.user.linkedId,
      department,
      caseType,
      verifiedBy, // staffId representing the doctor
      clinicalNotes,
      caseId: caseId || 'ANONYMOUS_CASE', // Stored safely
      verificationStatus: 'PENDING',
      date: new Date().toISOString()
    });
    
    res.status(201).json({ message: 'Clinical log submitted', logId: newLog.id });
  } catch (error) {
    console.error('Submit log error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyClinicalLog = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { logId } = req.params;
    const { status } = req.body; // VERIFIED | REJECTED
    
    const logDoc = await db.collection('clinicalLogs').doc(logId).get();
    
    if (!logDoc.exists) {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    const logData = logDoc.data();
    
    // Security layer: Ensure the staff verifying it is the one assigned
    if (logData.verifiedBy !== req.user.linkedId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You are not assigned to verify this log' });
    }
    
    await db.collection('clinicalLogs').doc(logId).update({
      verificationStatus: status,
      verifiedAt: new Date().toISOString()
    });
    
    res.status(200).json({ message: `Log ${status} successfully` });
  } catch (error) {
    console.error('Verify log error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { submitClinicalLog, verifyClinicalLog };
