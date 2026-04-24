const getDashboardStats = async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // Read from the singleton global metrics document instead of querying entire collections collections
    const statsDoc = await db.collection('analytics').doc('global_metrics').get();
    
    if (!statsDoc.exists) {
      // In a real system, the Cloud Function creates it if missing. Safe fallback here.
      return res.status(200).json({ 
        data: {
          totalStudents: 0,
          totalStaff: 0,
          totalFeesCollected: 0,
          lastUpdatedAt: new Date().toISOString()
        } 
      });
    }
    
    res.status(200).json({ data: statsDoc.data() });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDashboardStats };
