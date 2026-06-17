const foodPartnerModel = require("../models/foodpartner.model")
const foodModel = require("../models/food.model")
const saveModel = require("../models/save.model")


async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId);

    if (!foodPartner) {
        return res.status(404).json({
            message: "Food Partner not found"
        })
    }

    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId });

    // count unique users who have saved any food item belonging to this partner
    const foodIds = foodItemsByFoodPartner.map(f => f._id);
    const uniqueSavers = await saveModel.distinct('user', { food: { $in: foodIds } });
    const customersServed = uniqueSavers.length;

    return res.status(200).json({
        message: "Food Partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner,
            customersServed,
        }
    })
}


module.exports = {
    getFoodPartnerById,
}