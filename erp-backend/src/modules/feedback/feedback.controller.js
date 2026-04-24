const submitFeedback = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { targetEntity, targetId, rating, comments, isAnonymous } = req.body;
    // targetEntity could be 'COURSE', 'STAFF', 'HOSTEL'

    await db.collection('feedbacks').add({
      targetEntity,
      targetId,
      rating,
      comments,
      submittedBy: isAnonymous ? 'ANONYMOUS' : req.user.linkedId,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Feedback successfully submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error submitting feedback' });
  }
};

module.exports = { submitFeedback };
