const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
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

// ensure one save per actor per food
saveSchema.index({ user: 1, food: 1 }, { unique: true, sparse: true })
saveSchema.index({ foodPartner: 1, food: 1 }, { unique: true, sparse: true })

const saveModel = mongoose.model('save', saveSchema);
module.exports = saveModel;
