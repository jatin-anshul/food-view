const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel  = require('../models/likes.model');
const saveModel = require('../models/save.model');
const commentModel = require('../models/comment.model');
const {v4: uuid} = require('uuid');

async function createFood(req,res){

    const fileUploadResult = await storageService.uploadFile(req.file.buffer,uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id,
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem,

    })
}

async function getFoodItems(req,res){
    
    const foodItems = await foodModel.find({})

    res.status(200).json({
        message: "food items fetched successfully",
        foodItems
    })
}


async function searchFood(req, res) {
    const { q } = req.query;

    if (!q || !q.trim()) {
        return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(q.trim(), 'i');

    const foodItems = await foodModel
        .find({
            $or: [
                { name: regex },
                { description: regex },
            ]
        })
        .populate({ path: 'foodPartner', model: 'foodpartner', select: 'name address' })
        .limit(30);

    res.status(200).json({
        message: "Search results fetched successfully",
        foodItems,
    });
}


async function likeFood(req, res) {
    const { foodId } = req.body;

    // support both user and food partner as the actor
    const actorField = req.foodPartner ? 'foodPartner' : 'user';
    const actorId    = req.foodPartner ? req.foodPartner._id : req.user._id;

    const isAlreadyLiked = await likeModel.findOne({ [actorField]: actorId, food: foodId });

    if (isAlreadyLiked) {
        await likeModel.deleteOne({ [actorField]: actorId, food: foodId });

        const updated = await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        }, { returnDocument: 'after' });

        return res.status(200).json({
            message: "Food Unliked Successfully",
            likeCount: updated.likeCount,
        });
    }

    const like = await likeModel.create({ [actorField]: actorId, food: foodId });

    const updated = await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    }, { returnDocument: 'after' });

    res.status(201).json({
        message: "Food liked Successfully",
        like,
        likeCount: updated.likeCount,
    });
}


async function saveFood(req, res) {
    const { foodId } = req.body;

    const actorField = req.foodPartner ? 'foodPartner' : 'user';
    const actorId    = req.foodPartner ? req.foodPartner._id : req.user._id;

    const isAlreadySaved = await saveModel.findOne({ [actorField]: actorId, food: foodId });

    if (isAlreadySaved) {
        await saveModel.deleteOne({ [actorField]: actorId, food: foodId });

        const updated = await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        }, { returnDocument: 'after' });

        return res.status(200).json({
            message: "Food unsaved successfully",
            savesCount: updated.savesCount,
        });
    }

    const save = await saveModel.create({ [actorField]: actorId, food: foodId });

    const updated = await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    }, { returnDocument: 'after' });

    res.status(201).json({
        message: "Food saved successfully",
        save,
        savesCount: updated.savesCount,
    });
}


async function getMyInteractions(req, res) {
    const actorField = req.foodPartner ? 'foodPartner' : 'user';
    const actorId    = req.foodPartner ? req.foodPartner._id : req.user._id;

    const [likes, saves] = await Promise.all([
        likeModel.find({ [actorField]: actorId }).select('food'),
        saveModel.find({ [actorField]: actorId }).select('food'),
    ]);

    res.status(200).json({
        likedFoodIds: likes.map(l => l.food.toString()),
        savedFoodIds: saves.map(s => s.food.toString()),
    });
}


async function getSavedFood(req, res) {
    const actorField = req.foodPartner ? 'foodPartner' : 'user';
    const actorId    = req.foodPartner ? req.foodPartner._id : req.user._id;

    const saves = await saveModel.find({ [actorField]: actorId }).populate('food');

    const savedItems = saves.map(s => s.food).filter(Boolean);

    res.status(200).json({
        message: "Saved items fetched successfully",
        savedItems,
    });
}


async function addComment(req, res) {
    const { foodId, text } = req.body;
    const user = req.user;

    if (!text || !text.trim()) {
        return res.status(400).json({ message: "Comment text is required" })
    }

    const comment = await commentModel.create({
        user: user._id,
        food: foodId,
        text: text.trim(),
    })

    const updated = await foodModel.findByIdAndUpdate(foodId, {
        $inc: { commentCount: 1 }
    }, { returnDocument: 'after' })

    // populate user name for immediate display
    await comment.populate('user', 'fullName')

    res.status(201).json({
        message: "Comment added successfully",
        comment,
        commentCount: updated.commentCount,
    })
}


async function getComments(req, res) {
    const { foodId } = req.params;

    const comments = await commentModel
        .find({ food: foodId })
        .populate('user', 'fullName')
        .sort({ createdAt: -1 })

    res.status(200).json({
        message: "Comments fetched successfully",
        comments,
    })
}


async function deleteComment(req, res) {
    const { commentId } = req.params;

    // req.user is set by authUserMiddleware, req.foodPartner by authFoodPartnerMiddleware
    // one of them will be present depending on which middleware ran
    const requesterId = req.user?._id ?? req.foodPartner?._id;
    const isFoodPartner = !!req.foodPartner;

    const comment = await commentModel.findById(commentId).populate('food');

    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    if (isFoodPartner) {
        // food partner can only delete comments on their own food items
        const foodOwnerId = comment.food?.foodPartner?.toString();
        if (foodOwnerId !== req.foodPartner._id.toString()) {
            return res.status(403).json({ message: "You can only delete comments on your own food items" });
        }
    } else {
        // regular user can only delete their own comments
        if (comment.user.toString() !== requesterId.toString()) {
            return res.status(403).json({ message: "You can only delete your own comments" });
        }
    }

    await commentModel.findByIdAndDelete(commentId);

    const updated = await foodModel.findByIdAndUpdate(comment.food._id, {
        $inc: { commentCount: -1 }
    }, { returnDocument: 'after' });

    res.status(200).json({
        message: "Comment deleted successfully",
        commentCount: updated.commentCount,
    });
}


module.exports = {
     createFood,
     getFoodItems,
     searchFood,
     likeFood,
     saveFood,
     getSavedFood,
     addComment,
     getComments,
     deleteComment,
     getMyInteractions,
}