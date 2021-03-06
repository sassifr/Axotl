const jwt = require('jsonwebtoken')
const { createTransport, sendMail } = require('nodemailer')
const express = require('express')
const router = express.Router()
const config = require('config')
const bcrypt = require('bcryptjs')

const Recipient = require('../../models/Recipient')
const Sponsor = require('../../models/Sponsor')


//auth route
router.get('/', (req, res) => {
    try {
        if (!req.user) {
            return res.status(401)
        }
        // const user = {}
        // for (key in req.user) {
        //     if (key !== 'password') {
        //         user.key = req.user.key
        //     }
        // }
        console.log(req.session)
        res.json({ user: req.user })
            // res.json({ user: req.user })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


//GET /api/recipients/forgotpassword
//Action request password change
// PUBLIC
router.get('/forgotpassword/:email', async(req, res) => {
    const transporter = createTransport({
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
            user: config.get('emailUser'),
            pass: config.get('emailPass')
        },
        // tls: {
        //     ciphers: 'SSLv3'
        // }

    });
    let resetLink = '';
    let authToken = '';
    jwt.sign({ email: req.params.email }, config.get('JWTSecret'), { expiresIn: 10800000 }, (err, token) => {
        if (err) throw err;
        authToken += token;
        console.log(token)
        resetLink = `${config.get('productionLink')}/resetpassword/${authToken}`
    })
    const user = await Recipient.findOne({ email: req.params.email }) || await Sponsor.findOne({ email: req.params.email })
    if (user) {
        console.log(`user : ${user}`)
        console.log(`resetlink : ${resetLink}`)
        const mailOptions = {
            from: '"Axotl Support" <support@axotl.com>',
            to: req.params.email,
            subject: "Forgot Password",
            text: `Hello ${user.name},\n\nHere is the password reset link you requested (expires in 3 hours): ${resetLink}\n\n\nIf you did not request this, please notify us at http://axotl.com/support\n\nThanks!\n-Axotl Support`
        }
        try {
            console.log('trycatch entered')
            const verified = await transporter.verify((error, success) => {
                if (error) {
                    console.error(error.message)
                } else { console.log("Server is good") };
            })
            const response = await transporter.sendMail(mailOptions)
            console.log('email completed')
            console.log(response)

            res.json({ msg: 'Forgot Password Email Sent' })
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error")
        }
    } else {
        res.status(404).json({ msg: 'Account with that email does not exist' })
    }
})

//POST /api/recipients/resetpassword/:jwt
//Action send reset password
// PUBLIC (ish, no authentication)
router.post('/resetpassword/:jwt', async(req, res) => {
    try {
        console.log('backend reset reached')
        const email = await jwt.verify(req.params.jwt, config.get('JWTSecret')).email
        const user = await Recipient.findOne({ email: email })
        console.log(email)
        console.log(user)
        const { password } = req.body;
        if (password.length < 6) {
            res.status(400).json({ msg: 'Password too short' })
        }
        //ASSUMING PASSWORDS MATCH
        const salt = await bcrypt.genSalt(10)
        console.log(`Initial User :`)
        console.log(user)
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        console.log(`After User :`)
        console.log(user)
        res.json({ msg: "Password Changed" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

module.exports = router;