import mongoose from "mongoose";
import { INTEGER } from "sequelize";

const Schema = mongoose.Schema;

const BooksSchema = new Schema({
    bookName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rentPerDay: {
        type: Number,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    totelRentGenerated: {
        type: String
    },
    usersHistory: {
        user: [{
            userId: {
                type: Schema.Types.ObjectId, // If referencing another Users collection
                ref: 'Users'
            },
            userName: {
                type: String
            },
            userPhone: {
                type: String
            },
            bookIsIssueStatus: {
                type: String,
            },
            returnDate: {
                type: Date
            },
            rent: {
                type: String
            },
            bookIssueData: {
                type: Date
            }

        }]
    },
    bookIssueStatus: {
        type: String,
        default: 'available'
    }
});

const bookSchema = mongoose.model('books', BooksSchema);

export default bookSchema;
