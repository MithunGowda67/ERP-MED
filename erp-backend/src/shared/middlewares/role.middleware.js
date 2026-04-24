/**
 * Role-based authorization middleware.
 * Must be used AFTER auth.middleware.js
 * 
 * @param {Array<string>} allowedRoles - Array of roles e.g. ['admin', 'staff', 'student']
 */
const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.uid) {
        return res.status(401).json({ message: 'Unauthorized: User contextual missing' });
      }

      const db = req.app.locals.db;
      if (!db) {
        return res.status(500).json({ message: 'Internal Error: Database loosely coupled' });
      }

      const userDoc = await db.collection('users').doc(req.user.uid).get();
      
      if (!userDoc.exists) {
        return res.status(403).json({ message: 'Forbidden: User profile not found in Identity layer' });
      }
      
      const userData = userDoc.data();
      const userRole = userData.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
      }
      
      // Attach mapping references to request for downstream handlers
      req.user.role = userRole; 
      req.user.linkedId = userData.linkedId; 
      
      next();
    } catch (error) {
      console.error('Role validation error:', error);
      res.status(500).json({ message: 'Internal error validating roles' });
    }
  };
};

module.exports = { requireRole };
