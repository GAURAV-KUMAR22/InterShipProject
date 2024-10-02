import mongoose from "mongoose";

const Schema = mongoose.Schema;

const rentalInfo = new Schema({
    user: {
        userId: { type: String, ref: 'Users' },
        userName: { type: String, ref: 'Users' }
    },
    bookName: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date
    },
    returnDate: {
        type: Date,
        default: null
    },
    isReturned: {
        type: Boolean,
        default: false
    },
    rent: {
        type: String
    }
});

const rentalScehma = mongoose.model('Rental', rentalInfo);

export default rentalScehma;