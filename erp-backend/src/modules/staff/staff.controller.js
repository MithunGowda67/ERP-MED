/**
 * Staff HR and Payroll Logic
 */
const submitLeaveRequest = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { from, to, reason } = req.body;

    const newRequest = await db.collection('leaveRequests').add({
      staffRef: req.user.linkedId,
      from,
      to,
      reason,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Leave request submitted', leaveId: newRequest.id });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPendingLeaves = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const leavesSnap = await db.collection('leaveRequests').where('status', '==', 'PENDING').get();
    
    const leaves = leavesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ data: leaves });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generatePayroll = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { staffId, monthYear } = req.body;

    // 1. Fetch Staff Profile to get baseSalary
    const staffDoc = await db.collection('staff').doc(staffId).get();
    if (!staffDoc.exists) {
      return res.status(404).json({ message: 'Staff profile not found' });
    }
    const baseSalary = staffDoc.data().baseSalary || 0;

    // 2. Fetch specific month's leave history to calculate deductions natively
    // A production scenario would map dates accurately comparing monthYear string bounds.
    let unpaidDeductions = 0; // Mock calculation logic for structure clarity

    const netPay = baseSalary - unpaidDeductions;

    // 3. Document the payroll run
    const payrollDoc = await db.collection('payroll').add({
      staffRef: staffId,
      monthYear,
      baseSalary,
      deductions: unpaidDeductions,
      netPay,
      status: 'GENERATED',
      generatedAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Payroll generated successfully', netPay, payrollId: payrollDoc.id });
  } catch (error) {
    console.error('Payroll generation error:', error);
    res.status(500).json({ message: 'Internal server error calculating payroll' });
  }
};

module.exports = { submitLeaveRequest, getPendingLeaves, generatePayroll };
