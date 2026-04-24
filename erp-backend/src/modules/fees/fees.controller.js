const createFeeStructure = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { course, batch, academicYear, components, totalAmount } = req.body;
    
    const newDoc = await db.collection('feeStructures').add({
      course, batch, academicYear, components, totalAmount,
      createdAt: new Date().toISOString()
    });
    
    res.status(201).json({ message: 'Fee structure created', id: newDoc.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generateDemands = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { batch, structureId, amount, dueDate, type } = req.body;
    
    // Batch logic for creating demands
    const studentsSnapshot = await db.collection('students').where('batch', '==', batch).get();
    
    const batchWrite = db.batch();
    
    studentsSnapshot.forEach(studentDoc => {
      const demandRef = db.collection('students').doc(studentDoc.id).collection('feeDemands').doc();
      batchWrite.set(demandRef, {
        structureId,
        amount,
        dueDate,
        type,
        status: 'PENDING',
        paidAmount: 0,
        createdAt: new Date().toISOString()
      });
    });
    
    await batchWrite.commit();
    res.status(201).json({ message: `Successfully generated demands for ${studentsSnapshot.size} students` });
  } catch (error) {
    console.error('Demands error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { studentRef, demandRef, amount, method } = req.body;
    
    const newTx = await db.collection('transactions').add({
      studentRef,
      demandRef,
      amount,
      method,
      status: 'SUCCESS', // Assuming Gateway returns success
      date: new Date().toISOString()
    });
    
    // NOTE: Consistency logic to update `feeDemands` paidAmount and status
    // is to be handled by Firebase Cloud Function `onCreate` of `transactions`.
    
    res.status(201).json({ message: 'Transaction created successfully', transactionId: newTx.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createFeeStructure, generateDemands, createTransaction };
