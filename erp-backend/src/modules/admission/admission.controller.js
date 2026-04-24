const submitApplication = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { applicantName, email, phone, dob, courseApplied, quota } = req.body;
    
    const newDoc = await db.collection('applications').add({
      applicantName,
      email,
      phone,
      dob,
      courseApplied,
      quota,
      status: 'PENDING',
      documents: [],
      createdAt: new Date().toISOString(),
      uid: req.user.uid // the applicant's Firebase UID
    });
    
    res.status(201).json({ message: 'Application submitted', id: newDoc.id });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getApplications = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const snapshot = await db.collection('applications').get();
    
    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json({ data: applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    await db.collection('applications').doc(id).update({ 
      status,
      updatedAt: new Date().toISOString()
    });
    
    res.status(200).json({ message: `Application status updated to ${status}` });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { batch, registrationNo } = req.body;
    
    const appDoc = await db.collection('applications').doc(id).get();
    if (!appDoc.exists) return res.status(404).json({ message: 'Application not found' });
    
    const appData = appDoc.data();
    if (appData.status !== 'APPROVED') {
      return res.status(400).json({ message: 'Application must be APPROVED to enroll' });
    }
    
    // Create Student record
    const newStudent = await db.collection('students').add({
      name: appData.applicantName,
      email: appData.email,
      course: appData.courseApplied,
      batch,
      registrationNo,
      status: 'ACTIVE',
      currentSemester: 1
    });

    // Optionally update user identity layer to link to student mapping
    await db.collection('users').doc(appData.uid).update({
      role: 'student',
      linkedId: newStudent.id
    });
    
    res.status(201).json({ message: 'Student enrolled successfully', studentId: newStudent.id });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { submitApplication, getApplications, updateApplicationStatus, enrollStudent };
