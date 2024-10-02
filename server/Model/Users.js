import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    books: {
        type: Array,
        ref: 'books'
    }
}, { timestamps: true });


const userSchema = mongoose.model('Users', UsersSchema);

export default userSchema;