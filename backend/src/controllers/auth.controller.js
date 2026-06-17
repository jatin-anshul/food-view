const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const isProduction = process.env.NODE_ENV === 'production';

// SameSite='none' requires Secure=true (browsers reject it otherwise).
// In dev we use 'lax' so the cookie works over http://localhost.
const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000,
};

async function registerUser(req, res) {

    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exits"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        id: user._id,
    },process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })


}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email and password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email and password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions)

    res.status(201).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })

}

async function logoutUser(req,res){

    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message: "User logged out Successfully"
    });

}

async function registerFoodPartner(req,res){

    const {name , email , password,phone,address,contactName} = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if(isAccountAlreadyExists){
        return res.status(400).json({
            message:"Food Partner account already exits"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    })

    const token = jwt.sign({
        id: foodPartner._id,
    },process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions)

    res.status(201).json({
        message: "Food Partner register Successfully",
        foodPartner: {
            _id: foodPartner._id,
            email:foodPartner.email,
            name : foodPartner.name,
            address: foodPartner.address,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName
        }
    })


}


async function loginFoodPartner(req,res){

    const {email, password}  = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner){
        return res.status(400).json({
            message: "inavlid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,foodPartner.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    },process.env.JWT_SECRET)

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        message: "Food Partner logged in Successfully",
        foodPartner:{
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })


}

function logoutFoodPartner(req,res){
    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message: "Food partner logged out successfully"
    })
}

async function getMe(req, res) {
    const token = req.cookies?.token;
    if (!token) return res.status(200).json({ user: null });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // try user first
        const user = await userModel.findById(decoded.id).select('-password');
        if (user) {
            return res.status(200).json({
                user: { _id: user._id, fullName: user.fullName, email: user.email, role: 'user' }
            });
        }

        // try food partner
        const fp = await foodPartnerModel.findById(decoded.id).select('-password');
        if (fp) {
            return res.status(200).json({
                user: { _id: fp._id, fullName: fp.name, email: fp.email, role: 'foodPartner' }
            });
        }

        return res.status(200).json({ user: null });
    } catch {
        return res.status(200).json({ user: null });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    getMe,
}