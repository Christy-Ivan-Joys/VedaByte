import mongoose from "mongoose";

const categoryModel = new mongoose.Schema({

    category: {
        type: String,
        required: true
    },
    categoryImage: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})

export const categorySchema = mongoose.model('Category', categoryModel)