const express = require('express');
const UserController = require('../controllers/user');
const router = express.Router();
const authentication = require('../middlewares/authentication');



router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.use(authentication)
router.get('/profiles', UserController.showProfile)
router.put('/profiles', UserController.updateProfile)


module.exports = router;