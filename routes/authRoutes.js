// routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/protected', auth, (req, res) => {
    res.json({ msg: 'This is a protected route', user: req.user });
});

module.exports = router;