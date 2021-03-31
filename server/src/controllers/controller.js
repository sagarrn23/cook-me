import mongoose from 'mongoose';
import { RecipeSchema } from '../models/model';

const Recipe = mongoose.model('Recipe', RecipeSchema);

export const addRecipe = (req, res) => {
    let newRecipe = new Recipe(req.body);

    newRecipe.save((err, recipe) => {
        if(err) {
            res.send(err);
        }
        res.json(recipe);
    })
}

export const getRecipe = (req, res) => {
    Recipe.find({}, (err, recipe) => {
        if(err) {
            res.send(err);
        }
        res.json(recipe);
    });
}