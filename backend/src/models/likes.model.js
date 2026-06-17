const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    // one of user OR foodPartner will be set — not both
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodpartner',
        default: null,
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food',
        required: true,
    }
}, {
    timestamps: true,
})

// ensure one like per actor per food
likeSchema.index({ user: 1, food: 1 }, { unique: true, sparse: true })
likeSchema.index({ foodPartner: 1, food: 1 }, { unique: true, sparse: true })

const Like = mongoose.model('like', likeSchema);
module.exports = Like;
