if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const router = require('./routes'); 

app.use(cors());

// Middleware Body-Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. Integrasi Swagger Documentation
// Hanya tampil jika bukan di lingkungan production atau test
// if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
//   const swaggerUi = require('swagger-ui-express');
//   const swaggerSpec = require('./config/swagger');
  
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//     customSiteTitle: 'NutriGuide AI API Docs'
//   }));
// }

// 2. Gunakan Router utama
app.use(router);

// 3. Kondisi Listen (Sangat Penting untuk Testing!)
// Agar saat dijalankan oleh Jest/Supertest, app.listen tidak dipanggil lagi
// if (process.env.NODE_ENV !== 'test') {
//   app.listen(PORT, () => {
//     console.log(`App running on http://localhost:${PORT}`);
//     console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
//   });
// }

module.exports = app;