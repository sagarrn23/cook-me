import mongoose from 'mongoose';
import { 
    RecipeSchema,
    IngredientSchema,
    CategorySchema,
    TagSchema,
    AuthorSchema,
    FoodTypeSchema
} from '../models/modelOG';

const Recipe = mongoose.model('Recipe', RecipeSchema, 'recipes');
// const Ingredient = mongoose.model('Ingredient', IngredientSchema, 'ingredients');
const Category = mongoose.model('Category', CategorySchema, 'categories');
// const Tag = mongoose.model('Tag', TagSchema, 'tags');
// const Author = mongoose.model('Author', AuthorSchema, 'authors');
// const FoodType = mongoose.model('FoodType', FoodTypeSchema, 'foodtypes');

export const dataHandler = (req, res) => {
    const body = req.body;
    addRecipe(body, res);
    console.log(body);
    const categories = body.categories;
    // addCategory(categories);
}

const addRecipe = (data, res) => {
    
    let newRecipe = new Recipe(data);
    // console.log(newRecipe);

    newRecipe.save((err, recipe) => {
        if(err) {
            res.send(err);
        }
        res.json(recipe);
    })
}

const addCategory = (data, res) => {

    const formatData = data.map(item => {
        return {
            name: item
        }
    })
    
    let newCategory = new Category(data);
    newCategory.save((err, recipe) => {
        if(err) {
            res.send(err);
        }
        res.json(recipe);
    });

}

export const getRecipe = (req, res) => {
    Recipe.find({}, (err, recipe) => {
        if(err) {
            res.send(err);
        }
        res.json(recipe);
    });
}