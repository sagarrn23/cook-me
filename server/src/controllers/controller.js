import mongoose from 'mongoose';
import { 
    RecipeSchema,
    CategorySchema,
} from '../models/model';

const Recipe = mongoose.model('Recipe', RecipeSchema, 'recipes');
const Category = mongoose.model('Category', CategorySchema, 'categories');

export const createRecipeHandler = (req, res) => {
    const inputData = req.body;
    const addedRecipe = addRecipe(inputData);
    
    const categories = inputData.categories;
    const addedCategories = addCategory(categories, res);

    Promise.all([addedRecipe, addedCategories]).then(response => {
        // console.log(response);
        const recipeIds = response[0]._id;
        const catIds = response[1].map(cat => cat._id);
        Recipe.findByIdAndUpdate({_id: recipeIds}, {category_ids: catIds}, {new: true},(err, result) => {
            if(err) {
                res.send(err)
            }
            res.send(result)
        });

        catIds.forEach(id => {
            console.log(id);
            Category.findByIdAndUpdate({_id: id}, {recipe_ids: recipeIds}, {new: true}, (err, result) => {
                if(err) {
                    console.log(err)
                }
                console.log(result)
            })
        })
    })
}

const addRecipe = async (data) => {
    const addedData = await Recipe.create(data);
    return addedData;
}

const addCategory = async(data) => {

    const formatedData = data.map(item => {
        return {
            name: item
        }
    });

    const addedData = await Category.create(formatedData);
    return addedData;

}

export const getRecipe = (req, res) => {
    Recipe.find({}, (err, recipe) => {
        if(err) {
            res.send(err);
        }
        res.json(recipe);
    });
}