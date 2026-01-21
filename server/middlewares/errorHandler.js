module.exports = function errorHandler(error, req, res, next) {
    console.log(error);

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map((el) => el.message);
        return res.status(400).json({ message: errors });
    }

    if (error.name === 'Unauthorized') {
        return res.status(401).json({ message: error.message });
    }

    if (error.name === 'NotFound') {
        return res.status(404).json({ message: error.message });
    }

    if (error.name === 'Forbidden') {
        return res.status(403).json({ message: error.message });
    }

    if (error.name === 'BadRequest') {
        return res.status(400).json({ message: error.message });
    }

    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    if (error.isAxiosError) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'External API Error';
        return res.status(status).json({ message: `Service Error: ${message}` });
    }
    
    res.status(500).json({ message: 'Internal Server Error' });
} 