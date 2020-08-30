const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { registerValidation, loginValidation } = require('../validation')

/**
 * Registration of a user will place their credentials in an adjacent DB. The creds
 * can be used against the login route to obtain the actual token
 */
router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password } = req.body

    const emailExists = await User.findOne({ email })
    if (emailExists) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
})

/**
 * Logging in yields a header token that can be used in future network reqs
 */
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).send('Email or password is incorrect');
    const validPass = await bcrypt.compare(password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')

    const token = jwt.sign({_id: user._id, issued: Math.round(new Date().getTime() / 1000)}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

})

module.exports = router;