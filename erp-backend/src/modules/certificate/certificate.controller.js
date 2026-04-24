const issueCertificate = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { studentId, type } = req.body; // e.g. "TRANSCRIPT", "COMPLETION", "BONAFIDE"

    // Verify student exists
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const newCert = await db.collection('certificates').add({
      studentRef: studentId,
      type,
      certificateUrl: `https://storage.provider/erp/certificates/${studentId}_${type}.pdf`,
      issuedBy: req.user.linkedId,
      issuedAt: new Date().toISOString()
    });

    res.status(201).json({ message: `Certificate of type ${type} issued`, certId: newCert.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error creating certificate' });
  }
};

module.exports = { issueCertificate };
