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