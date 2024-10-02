import { Router } from "express";
import rentalScehma from "../Model/Rental.js";
import userSchema from "../Model/Users.js";
import { verifyToken } from "../Service/CheckAuth.js";
import bookSchema from "../Model/Books.js";
const route = Router();


// ***********************************************************************************************************************************
//                    In this file two Routes FirstOne "ORDER BOOK" and Second "RETURN boOK"
// ***********************************************************************************************************************************




//This route for Order Book
route.post("/issueBook", verifyToken, async (req, res) => {
    try {
        const data = req.query;
        const { bookName, issueDate } = data;
        const _id = req.user.user._id;
        const existedUser = await userSchema.findOne({ _id });
        const existedBook_status = await bookSchema.findOne({ bookName });
        if (existedBook_status.bookIssueStatus === 'available') {

            if (!existedUser) {
                throw new Error({ status: 500, message: "user does not exist" });
            }
            const rent = new rentalScehma({
                user: {
                    userName: existedUser.userName,
                    userId: existedUser._id
                },
                bookName,
                userId: _id,
                issueDate,
            });
            await rent.save();
            console.log('rent saved')
            const book = await bookSchema.findOne({ bookName });
            book.bookIssueStatus = 'On rent';
            book.usersHistory.user.push({
                userId: existedUser._id,
                userName: existedUser.userName,
                userPhone: existedUser.phone,
                bookIssueStatus: 'On rent',
                returnDate: '',
                rent: ''
            });

            await book.save();
            console.log('book saved')

            existedUser.books.push({
                bookName,
                issueDate: new Date(issueDate),
                returnDate: "",
                isReturned: false,
            });

            await existedUser.save();
            console.log('existing User saved')
            res.status(200).json(existedUser);
        }
    } catch (error) {
        console.log(error);
    }
});


// *******************************************************************************************************************************
//------------This route for return book
// route.post("/returnBook", verifyToken, async (req, res, next) => {
//     try {
//         const data = req.query;
//         const { bookName, returnDate } = data;
//         const _id = req.user.user._id;

//         const existedBook = await bookSchema.findOne({ bookName });
//         // if (existedBook.bookIssueStatus === 'available') {
//         //     return res.json({ message: 'This book is already available, you cannot return it.' });
//         // }

//         const existedUser = await userSchema.findOne({ _id });
//         if (!existedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const existedRentalBook = await rentalScehma.findOne({ bookName });
//         if (!existedRentalBook) {
//             return res.status(404).json({ message: "No rental record found for this book" });
//         }

//         const issueDateObj = new Date(existedRentalBook.issueDate);
//         const returnDateObj = new Date(returnDate);
//         const totalDays = Math.ceil((returnDateObj - issueDateObj) / (1000 * 60 * 60 * 24));
//         const rentPerDay = existedBook.rentPerDay;
//         const totalRent = totalDays * rentPerDay;

//         existedRentalBook.returnDate = returnDateObj;
//         existedRentalBook.rent = totalRent;
//         existedRentalBook.isReturned = true;
//         await existedRentalBook.save();

//         // Update user's book record for this specific rental
//         const bookIndex = existedUser.books.findIndex((book) => book.bookName === existedRentalBook.bookName && !book.isReturned);
//         if (bookIndex !== -1) {
//             await existedUser.updateOne({
//                 $set: {
//                     [`books.${bookIndex}.returnDate`]: returnDateObj,
//                     [`books.${bookIndex}.isReturned`]: true,
//                 },
//             });
//         }

//         // Find all instances of this user in usersHistory where the return hasn't been processed yet
//         existedBook.usersHistory.user.forEach(async (userRecord, index) => {
//             if (userRecord.userId.equals(_id) && !userRecord.returnDate) {
//                 await existedBook.updateOne({
//                     $set: {
//                         [`usersHistory.user.${index}.returnDate`]: returnDateObj,
//                         [`usersHistory.user.${index}.rent`]: totalRent,
//                     }
//                 });
//             }
//         });

//         // Update the book's status to available
//         await existedBook.updateOne({ bookIssueStatus: 'available' });


//         res.status(200).json({ message: 'Book return processed successfully', existedUser });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "An error occurred while processing the request." });
//     }
// });

route.post("/returnBook", verifyToken, async (req, res, next) => {
    try {
        const data = req.query;
        const { bookName, returnDate } = data;
        const _id = req.user.user._id;

        const existedBook = await bookSchema.findOne({ bookName });
        if (existedBook.bookIssueStatus === 'available') {
            return res.json({ message: 'This book is already available, you cannot return it.' });
        }

        const existedUser = await userSchema.findOne({ _id });
        if (!existedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const existedRentalBook = await rentalScehma.findOne({ bookName });
        if (!existedRentalBook) {
            return res.status(404).json({ message: "No rental record found for this book" });
        }

        // Calculate rent for the current rental
        const issueDateObj = new Date(existedRentalBook.issueDate);
        const returnDateObj = new Date(returnDate);
        const totalDays = Math.ceil((issueDateObj - returnDateObj) / (1000 * 60 * 60 * 24));
        const rentPerDay = existedBook.rentPerDay;
        const totalRent = totalDays * rentPerDay;

        // Update rental book information
        existedRentalBook.returnDate = returnDateObj;
        existedRentalBook.rent = totalRent;
        existedRentalBook.isReturned = true;
        await existedRentalBook.save();

        // Update the user's book information
        const bookIndex = existedUser.books.findIndex((book) => book.bookName === existedRentalBook.bookName && !book.isReturned);
        if (bookIndex !== -1) {
            await existedUser.updateOne({
                $set: {
                    [`books.${bookIndex}.returnDate`]: returnDateObj,
                    [`books.${bookIndex}.isReturned`]: true,
                },
            });
        }

        // Update each user's history in the book schema
        existedBook.usersHistory.user.forEach(async (userRecord, index) => {
            if (userRecord.userId.equals(_id) && !userRecord.returnDate) {
                await existedBook.updateOne({
                    $set: {
                        [`usersHistory.user.${index}.returnDate`]: returnDateObj,
                        [`usersHistory.user.${index}.rent`]: totalRent,
                    }
                });
            }
        });

        const totalRentGenerated = existedBook.usersHistory.user.reduce((total, userRecord) => {
            return total + (parseFloat(userRecord.rent) || 0);
        }, 0);

        // Update the book's total rent generated and availability status
        await existedBook.updateOne({
            totelRentGenerated: totalRentGenerated, // Update the total rent generated
            bookIssueStatus: 'available'
        });

        res.status(200).json({ message: 'Book return processed successfully', existedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while processing the request." });
    }
});



export default route;
