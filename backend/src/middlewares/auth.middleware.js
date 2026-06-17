const foodPartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!foodPartner) {
            return res.status(401).json({
                message: "Account not found. Please login again."
            })
        }

        req.foodPartner = foodPartner

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }



}


async function authUserMiddleware(req,res,next){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message: "Please login first",
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Account not found. Please login again."
            })
        }

        req.user = user
        
        next()
    } catch(err){
        return res.status(401).json({
            message: "Invalid token"
        })
    }




}



// Accepts either a user or food partner token — sets req.user or req.foodPartner
async function authAnyMiddleware(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if (user) {
            req.user = user;
            return next();
        }

        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (foodPartner) {
            req.foodPartner = foodPartner;
            return next();
        }

        return res.status(401).json({ message: "Account not found. Please login again." });

    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}


module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
    authAnyMiddleware,
}
