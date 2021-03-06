const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    purchasedCourse: { //an array of course ids
        type: Array,
        default:[]
    },
    likedCourses : {
        type: Array,
        default:[]
    },
    isInstructor : {
        type: Boolean,
        default: 0
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;