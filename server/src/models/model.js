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
    tag_ids: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    author_ids: {
        type: Schema.Types.Mixed,
        required: true,
        default: 0
    },
    ingredient_ids: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    directions:[{
        type: String,
        required: false
    }],
    time_created:{
        type: Number,
        required: true
    },
    time_updated:{
        type: Number,
        required: false
    },
    benefits: [{
        type: String,
        required: false
    }],
    special_notes: [{
        type: String,
        required: false
    }],
    food_type: {
        type: String,
        required: true
    }
});

export const TaxonomySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    recipe_ids: [{
        type: Schema.Types.Mixed,   
        required: true
    }]
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
    }
});