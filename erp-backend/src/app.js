require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Database / Core
const { db } = require('./shared/firebase/firebase');

const app = express();

// Set DB in app locals for easy access in controllers
app.locals.db = db;

// Middlewares
const { globalLimiter } = require('./shared/middlewares/rateLimit.middleware');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Apply rate limiter logic globally (can optionally be localized)
app.use(globalLimiter);

// Root path redirect
app.get('/', (req, res) => {
  res.redirect('/health');
});

// Basic Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Route Imports
const identityRoutes = require('./modules/identity/identity.routes');
const admissionRoutes = require('./modules/admission/admission.routes');
const feesRoutes = require('./modules/fees/fees.routes');
const academicRoutes = require('./modules/academic/academic.routes');
const clinicalRoutes = require('./modules/clinical/clinical.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const hostelRoutes = require('./modules/hostel/hostel.routes');
const examinationRoutes = require('./modules/examination/examination.routes');
const staffRoutes = require('./modules/staff/staff.routes');
const storeRoutes = require('./modules/store/store.routes');
const certificateRoutes = require('./modules/certificate/certificate.routes');
const feedbackRoutes = require('./modules/feedback/feedback.routes');
const alumniRoutes = require('./modules/alumni/alumni.routes');

// Modular Routes
app.use('/api/v1/identity', identityRoutes);
app.use('/api/v1/admissions', admissionRoutes);
app.use('/api/v1/fees', feesRoutes);
app.use('/api/v1/academic', academicRoutes);
app.use('/api/v1/clinical', clinicalRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/hostels', hostelRoutes);
app.use('/api/v1/exams', examinationRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/certificates', certificateRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/alumni', alumniRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Medical ERP Backend running on port ${PORT}`);
});
