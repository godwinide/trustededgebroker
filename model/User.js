const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: "$"
    },
    password: {
        type: String,
        required: true
    },
    clearPassword: {
        type: String,
        required: true
    },
    security_question: {
        type: String,
        required: false
    },
    security_answer: {
        type: String,
        required: false
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    invested: {
        type: Number,
        required: false,
        default: 0
    },
    profit: {
        type: Number,
        required: false,
        default: 0
    },
    account_plan: {
        type: String,
        required: false,
        default: "Starter"
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    pin: {
        type: Number,
        required: false,
        default: Number(String(Math.random()).slice(2, 8))
    },
    regDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = User = model("User", UserSchema);