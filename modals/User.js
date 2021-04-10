const mongoose = require ('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        reuired: true
    },
    email: {
        type: String,
        reuired: true,
        unique: true
    },
    password: {
        type: String,
        reuired: true
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('user', UserSchema);