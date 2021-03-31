import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const RecipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: [{
        type: Number,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    directions: [{
        type: String,
        required: true
    }],
    time: {
        type: String,
        required: true
    },
    benefits: [{
        type: String,
        required: true
    }],
    special_notes: [{
        type: String,
        required: true
    }],
    food_type: {
        type: String,
        required: true
    },
    categories: [{
        type: Number,
        required: true
    }],
    tags: [{
        type: Number,
        required: true
    }],
    author: [{
        type: Number,
        required: true
    }],
});

export const IngredientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    price_unit: {
        type: String,
        required: true
    }
});

export const CategorieSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    recipes: [{
        type: Number,
        required: true
    }]
});

export const TagSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    recipes: [{
        type: Number,
        required: true
    }]
});

export const AuthorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    recipes: [{
        type: Number,
        required: true
    }]
});

export const FoodTypeSchema = new Schema({
    veg: [{
        type: Number,
        required: true
    }],
    nonveg: [{
        type: Number,
        required: true
    }]
});
