const getProfile = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const uid = req.user.uid;
    
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.status(200).json({ data: userDoc.data() });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const setupProfile = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const uid = req.user.uid;
    const { role, linkedId, email } = req.body;
    
    // In a real app, only admins could create roles for others, or there'd be an invitation system.
    // Here we're allowing initial setup for demonstration.
    
    await db.collection('users').doc(uid).set({
      role,
      linkedId: linkedId || null,
      email: email || req.user.email,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    });
    
    res.status(201).json({ message: 'Profile setup successful' });
  } catch (error) {
    console.error('Error setting up profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getProfile, setupProfile };
