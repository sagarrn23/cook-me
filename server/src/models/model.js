import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const RecipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category_ids: [{
        type: Schema.Types.Mixed,
        required: true
    }],
});

export const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    recipe_ids: [{
        type: Schema.Types.Mixed,   
        required: true
    }]
});