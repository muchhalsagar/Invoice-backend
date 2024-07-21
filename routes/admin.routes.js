const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


/********************************************** 
*@login
*@route http://localhost:5000/api/admin/login
*@Description API for Admin Login
*@return Success Message and token
**********************************************/
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and Password Required...' });
      }
      if (username === 'admin' && password === 'admin@123') {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login Success..', token });
      }
      res.status(400).json({ message: 'Invalid Credentials...' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
