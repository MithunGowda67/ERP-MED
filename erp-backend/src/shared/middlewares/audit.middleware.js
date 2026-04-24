/**
 * System Audit Middleware.
 * Automatically crafts a log entry within the `auditLogs` Firestore collection.
 * Required for ERP regulatory compliance whenever sensitive actions occur.
 * 
 * @param {string} action - e.g. 'VERIFY_LOG', 'CREATE_STUDENT'
 * @param {string} entity - e.g. 'clinicalLog', 'application'
 */
const auditLog = (action, entity) => {
  return async (req, res, next) => {
    // We attach a listener to 'finish' so the audit fires *after* the request completes,
    // thereby not directly harming latency.
    res.on('finish', () => {
      // Only log on successful mutations to avoid spamming errors unless desired.
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const db = req.app.locals.db;
          const uid = req.user ? req.user.uid : 'system';
          
          // Attempt to extract an entity ID logically. 
          // Customarily it's in params.id or response body payload
          // For a robust system, controllers could attach it via `res.locals.entityId`.
          const entityId = req.params.id || req.params.logId || res.locals.entityId || 'UNKNOWN';

          db.collection('auditLogs').add({
            userId: uid,
            action,
            entity,
            entityId,
            method: req.method,
            endpoint: req.originalUrl,
            status: res.statusCode,
            timestamp: new Date().toISOString()
          }).catch(err => console.error('Audit Logger Background Err:', err));
        } catch (e) {
          // Swallow error to not interrupt node thread.
          console.error('Audit Logger Execution Err:', e);
        }
      }
    });

    next();
  };
};

module.exports = { auditLog };
