import { Router } from "express";
import bookSchema from "../Model/Books.js";
import { verifyToken } from "../Service/CheckAuth.js";
import { compareSync } from "bcrypt";
const route = Router();

// *****************************************************************************************************************************************
//                     IN THIS FILE ALL BOOK RELETED Route
// *****************************************************************************************************************************************

route.get('/allbooks', async (req, res) => {
    const data = await bookSchema.find({});
    res.status(200).send(data)
});

route.get('/:id', async (req, res) => {
    const id = req.params.id;
    const data = await bookSchema.findById({ _id: id });
    res.status(200).json(data);
})

route.post('/addBook', async (req, res) => {
    const { bookName, category, rentPerDay, imageLink } = data;
    if (!bookName || !category || !rentPerDay || !imageLink) {
        throw new Error({ status: 400, message: "All fields are Required" })
    }
    const existedBook = await bookSchema.findOne({ bookName: bookName });
    if (!existedBook) {
        const books = new bookSchema({
            bookName,
            category,
            rentPerDay,
            imageLink
        });

        await books.save();
        res.send(books).json({ status: 201, message: "books created Successfully" })
    }
    res.json({ status: 208, message: 'This book creted Already' })
});

route.get('/', async (req, res) => {
    console.log(req.query)
    const { bookName, rentPerDay, category, sort } = req.query;
    console.log(sort)
    try {

        const query = {};

        if (bookName) {
            query.bookName = { $regex: bookName, $options: 'i' }; // Case-insensitive search
        }

        if (rentPerDay) {
            query.rentPerDay = { $regex: rentPerDay, $options: 'String' };
        }

        if (category) {
            query.category = category; // Exact match
        }

        let fetch_Api = bookSchema.find(query);

        if (sort) {
            let sorting = sort.replace(",", " ");
            query.sort = sorting;
            console.log(sorting)
            fetch_Api.sort(sorting);
            // console.log("fetchapi", fetch_Api)
        }
        const books = await fetch_Api;
        console.log(books)
        res.send(books);

    } catch (error) {
        return res.errored({ message: error });
    }
});


route.get('/book/:id', async (req, res) => {
    const id = req.params.id;
    const existingBook = await bookSchema.findOne({ _id: id });
    const responce = JSON.stringify(existingBook);
    res.send(responce)
})

export default route;