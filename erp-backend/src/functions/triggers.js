/**
 * Firebase Cloud Functions Definitions
 * These would typically be deployed via the Firebase CLI from a dedicated `functions` folder.
 * Scaffolded here to demonstrate the consistency layer.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// 1. Transaction Consistency Trigger
exports.onTransactionCreated = functions.firestore
  .document('transactions/{txId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const db = admin.firestore();

    if (data.status === 'SUCCESS') {
      // It's a successful payment, update the fee demand
      const demandRef = data.demandRef; // assuming valid DocumentReference or path string
      const demandPath = typeof demandRef === 'string' ? demandRef : demandRef.path;

      await db.runTransaction(async (t) => {
        const demandSnap = await t.get(db.doc(demandPath));
        if (!demandSnap.exists) return;

        const currentPaid = demandSnap.data().paidAmount || 0;
        const newPaidAmount = currentPaid + data.amount;
        const totalDemanded = demandSnap.data().amount;

        t.update(db.doc(demandPath), {
          paidAmount: newPaidAmount,
          status: newPaidAmount >= totalDemanded ? 'PAID' : 'PARTIAL'
        });
      });

      // Also increment global fee dashboard metrics
      await db.collection('analytics').doc('global_metrics').set({
        totalFeesCollected: admin.firestore.FieldValue.increment(data.amount),
        lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }
  });

// 2. Student Count Dashboard Trigger
exports.onStudentCreated = functions.firestore
  .document('students/{studentId}')
  .onCreate(async (snap, context) => {
    const db = admin.firestore();
    
    await db.collection('analytics').doc('global_metrics').set({
      totalStudents: admin.firestore.FieldValue.increment(1),
      lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

exports.onStudentDeleted = functions.firestore
  .document('students/{studentId}')
  .onDelete(async (snap, context) => {
    const db = admin.firestore();
    
    await db.collection('analytics').doc('global_metrics').set({
      totalStudents: admin.firestore.FieldValue.increment(-1),
      lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

// 3. Automated Hostel Fee Allocation Trigger
exports.onHostelAllocationCreated = functions.firestore
  .document('hostelAllocations/{allocationId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const db = admin.firestore();

    // Dynamically link Fee structure. Assuming "HOSTEL_FEE_2026" identifier.
    const feeStructureId = "HOSTEL_FEE_2026"; 
    const amount = 50000; // Mock base fee retrieved from feeStructures collection

    await db.collection('students').doc(data.studentId).collection('feeDemands').add({
      structureId: feeStructureId,
      amount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      type: 'Hostel Fee',
      status: 'PENDING',
      paidAmount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp() // Guaranteed chronological consistency
    });
  });
