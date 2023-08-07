const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    _id: { type: Schema.Types.UUID, default: () => mongoose.Types.UUID() },
    userEmail: {
        type: String,
        required: [true, "Email address is required."],
        unique: [true, "This Email address already taken."],
      },
    userName: {
        type: String,
        required: [true, "Username is required."],
        unique: [true, "This username is already taken."]
      },
    userPassword: {
        type: String,
        required: [true, 'Password is required.']
    },
    approvalStatus: Boolean,
    userRole: String,
    userSalt: String
},
{ timestamps: true });
module.exports = mongoose.model("User", userSchema);

