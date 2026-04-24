const allocateRoom = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { hostelId, roomId, studentId } = req.body;

    const roomRef = db.collection('hostels').doc(hostelId).collection('rooms').doc(roomId);

    await db.runTransaction(async (t) => {
      const roomSnap = await t.get(roomRef);
      if (!roomSnap.exists) {
        throw new Error('Room not found');
      }

      const roomData = roomSnap.data();
      const occupantsSnap = await t.get(roomRef.collection('occupants'));
      
      if (occupantsSnap.size >= roomData.capacity) {
        throw new Error('Room is at full capacity');
      }

      const newOccupantRef = roomRef.collection('occupants').doc(studentId);
      t.set(newOccupantRef, {
        allocatedAt: new Date().toISOString(),
        status: 'ACTIVE'
      });

      const allocationRef = db.collection('hostelAllocations').doc();
      t.set(allocationRef, {
        studentId,
        hostelId,
        roomId,
        startDate: new Date().toISOString(),
        status: 'ACTIVE'
      });
      // The Cloud Function Trigger `onHostelAllocationCreated` intercepts this document to configure Fees magically.
    });

    res.status(201).json({ message: 'Room allocated successfully' });
  } catch (error) {
    console.error('Hostel allocation error:', error);
    res.status(error.message.includes('capacity') ? 400 : 500).json({ message: error.message });
  }
};

const logMovement = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { hostelId } = req.params;
    const { studentId, type, reason } = req.body;

    // Optional robustness: Verify the student's final state prior to approving IN/OUT to prevent double logging.
    
    await db.collection('hostels').doc(hostelId).collection('movementRegister').add({
      studentId,
      type,
      reason: reason || null,
      timestamp: new Date().toISOString(),
      approvedBy: req.user.role === 'staff' ? req.user.linkedId : null 
    });

    res.status(201).json({ message: `Movement logged: ${type}` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error while logging movement' });
  }
};

const registerVisitor = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { hostelId } = req.params;
    const { studentId, visitorName, relation, contactPhone, purpose } = req.body;

    const newVisitor = await db.collection('hostels').doc(hostelId).collection('visitors').add({
      studentId,
      visitorName,
      relation,
      contactPhone,
      purpose,
      checkIn: new Date().toISOString(),
      checkOut: null
    });

    res.status(201).json({ message: 'Visitor registered', visitorId: newVisitor.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error bridging visitor check-in' });
  }
};

const checkoutVisitor = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { hostelId, visitorId } = req.params;

    await db.collection('hostels').doc(hostelId).collection('visitors').doc(visitorId).update({
      checkOut: new Date().toISOString()
    });

    res.status(200).json({ message: 'Visitor checked out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error during visitor check-out' });
  }
};

module.exports = { allocateRoom, logMovement, registerVisitor, checkoutVisitor };
