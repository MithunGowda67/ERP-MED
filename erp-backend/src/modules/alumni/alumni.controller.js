const transitionToAlumni = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { studentId, placementDetails } = req.body;

    const studentRef = db.collection('students').doc(studentId);

    await db.runTransaction(async (t) => {
      const studentSnap = await t.get(studentRef);
      if (!studentSnap.exists) throw new Error('Student not found');
      if (studentSnap.data().status === 'ALUMNI') throw new Error('Already transitioned to Alumni');

      // Update native status
      t.update(studentRef, { status: 'ALUMNI' });

      // Create dedicated alumni record
      const alumniRef = db.collection('alumni').doc(studentId);
      t.set(alumniRef, {
        studentRef: studentId,
        graduatedAt: new Date().toISOString(),
        placementDetails: placementDetails || null
      });
    });

    res.status(200).json({ message: `Successfully transitioned student ${studentId} to Alumni` });
  } catch (error) {
    const status = error.message.includes('not found') || error.message.includes('Already') ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

module.exports = { transitionToAlumni };
