const express  = require('express');
const authController = require("../controllers/auth.controller");

const router = express.Router();


// user auth api
router.post('/user/register',authController.registerUser)
router.post('/user/login',authController.loginUser)
router.get('/user/logout',authController.logoutUser)

// GET /api/auth/me — identify current logged-in user or food partner
router.get('/me', authController.getMe)

// food partner api 

router.post('/food-partner/register',authController.registerFoodPartner)
router.post('/food-partner/login',authController.loginFoodPartner)
router.get('/food-partner/logout',authController.logoutFoodPartner)



module.exports = router;