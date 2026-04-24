const { z } = require('zod');

const movementSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'studentId is required'),
    type: z.enum(['IN', 'OUT'], { required_error: 'Type must be IN or OUT' }),
    reason: z.string().optional()
  })
});

const visitorSchema = z.object({
  body: z.object({
    studentId: z.string().min(1, 'studentId is required'),
    visitorName: z.string().min(2, 'Visitor name must be at least 2 characters'),
    relation: z.string().min(2, 'Relation must be strictly defined'),
    contactPhone: z.string().min(10, 'Valid contact phone required'),
    purpose: z.string().min(3, 'Purpose of visit required')
  })
});

module.exports = {
  movementSchema,
  visitorSchema
};
