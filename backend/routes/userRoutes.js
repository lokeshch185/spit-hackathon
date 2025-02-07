const express = require('express');
const {verifyToken} = require('../middleware/authMiddleware');
const {signin,signup, getUserSuggestions} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/userdata',verifyToken,getUserSuggestions);

module.exports = router;
