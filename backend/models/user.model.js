const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   fullName: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   createdOn: { type: Date, default: Date.now },
});

// userSchema.methods.encryptPassword = async (password) => {
//    const salt = await bcrypt.genSalt(10);
//    const hash = await bcrypt.hash(password, salt);
//    return hash;
// };

module.exports = mongoose.model('User', userSchema);
