const { Router } = require("express");
const router = Router()
const {body} = require("express-validator")
const User = require("../models/user");


const authController = require("../controllers/auth");


router.get("/login", authController.getLogin)

router.get("/signup", authController.getSignup)

router.post(
"/login",
[
    body("email", 'Please enter a valid email')
    .isEmail()
    .normalizeEmail(),

    body("password", "The password must contain at least five characters")
    .isLength({min: 5})
    .trim()
],
authController.postLogin
)

router.post(
"/signup", 
[
    body("email")
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
        return User.findOne({email: value}).then(userDoc => {
            if (userDoc){
                return Promise.reject("E-mail already exists, try a new one or log in");
            }
        });
    })
    .normalizeEmail(),

    body("password", "The password must contain at least five characters")
    .isLength({min: 5})
    .trim(),

    body("confirmPassword")
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords have to match!")
        }
        return true;
    })
    .trim()
],
authController.postSignup
)

router.post("/logout", authController.postLogout)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post("/new-password", authController.postNewPassword)

module.exports = router