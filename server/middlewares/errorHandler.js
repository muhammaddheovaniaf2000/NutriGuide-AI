module.exports = function errorHandler(error, req, res, next) {
    console.log("======== DEBUG ERROR ========");
    console.log(error); 
    console.log("=============================");

    let status = 500;
    let message = 'Internal Server Error';

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        status = 400;
        // Mengambil pesan pertama dari array errors Sequelize
        message = error.errors[0].message;
    } else if (error.name === 'Unauthorized' || error.name === 'JsonWebTokenError') {
        status = 401;
        message = error.name === 'JsonWebTokenError' ? 'Invalid Token' : error.message;
    } else if (error.name === 'NotFound') {
        status = 404;
        message = error.message;
    } else if (error.name === 'Forbidden') {
        status = 403;
        message = error.message;
    } else if (error.name === 'BadRequest') {
        status = 400;
        message = error.message;
    } else if (error.isAxiosError) {
        status = error.response?.status || 500;
        message = `Service Error: ${error.response?.data?.message || 'External API Error'}`;
    }

   res.status(status).json({ 
    message, 
    debug: error.message, // Ini akan memunculkan detail error di Postman
    name: error.name      // Ini akan memberi tahu kategori errornya
});
};