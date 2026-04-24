const admin = require('firebase-admin');

const recordStockTransaction = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { itemRef, type, quantity } = req.body; // type: "IN" | "OUT"

    if (!['IN', 'OUT'].includes(type) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid transaction parameters' });
    }

    const inventoryDocRef = db.collection('inventoryItems').doc(itemRef);

    // Write the transaction record
    const newTx = await db.collection('stockTransactions').add({
      itemRef,
      type,
      quantity,
      requestedBy: req.user.linkedId,
      date: new Date().toISOString()
    });

    // Update parent inventory stock levels dynamically ensuring no race conditions
    const incrementValue = type === 'IN' ? quantity : -quantity;
    
    await inventoryDocRef.update({
      currentStock: admin.firestore.FieldValue.increment(incrementValue),
      lastUpdated: new Date().toISOString()
    });

    res.status(201).json({ message: 'Stock updated successfully', txId: newTx.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error while tracking stock' });
  }
};

module.exports = { recordStockTransaction };
