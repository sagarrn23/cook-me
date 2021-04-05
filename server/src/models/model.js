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
    // ingredients: [{
    //     ingredient_id: {
    //         type: Schema.Types.Mixed,
    //         required: true
    //     },
    //     qty: {
    //         type: Number,
    //         required: true
    //     },
    //     unit: {
    //         type: String,
    //         required: true
    //     }
    // }],
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