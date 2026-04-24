const { ZodError } = require('zod');

/**
 * Validation Middleware generator leveraging Zod.
 * @param {import('zod').ZodObject} schema 
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parses logic synchronously. Unstripped body stays in `req.body`
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        });
      }
      next(error);
    }
  };
};

module.exports = { validate };
