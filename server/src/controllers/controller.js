import mongoose from 'mongoose';
import { 
    RecipeSchema,
    TaxonomySchema,
} from '../models/model';

const Recipe = mongoose.model('Recipe', RecipeSchema, 'recipes');
const Category = mongoose.model('Category', TaxonomySchema, 'categories');
const Tag = mongoose.model('Tag', TaxonomySchema, 'tags');
const Author = mongoose.model('Author', TaxonomySchema, 'authors');

export const createRecipeHandler = (req, res) => {
    const inputData = req.body;
    const addedRecipe = addRecipe(inputData);
    
    const categories = inputData.categories;
    const addedCategories = addTaxonomy(categories, Category);

    const tags = inputData.tags;
    const addedTags = addTaxonomy(tags, Tag);

    const authors = inputData.author;
    const addedAuthors = addTaxonomy(authors, Author);

    Promise.all([addedRecipe, addedCategories, addedTags, addedAuthors])
            .then(response => {
                // console.log(response);
                const recipeIds = response[0]._id;
                const catIds = response[1].map(cat => cat._id);
                const tagIds = response[2].map(tag => tag._id);
                const authorIds = response[3].map(author => author._id);
                Recipe.findByIdAndUpdate(
                    {_id: recipeIds}, 
                    {
                        category_ids: catIds,
                        tag_ids: tagIds,
                        author_ids: authorIds
                    }, 
                    {new: true}, 
                    (err, result) => {
                        if(err) {
                            console.log(err)
                        }
                        console.log(result)
                    }
                );

                catIds.forEach(id => {
                    Category.findByIdAndUpdate({_id: id}, {recipe_ids: recipeIds}, {new: true}, (err, result) => {
                        if(err) {
                            console.log(err)
                        }
                        console.log(result)
                    })
                })

                tagIds.forEach(id => {
                    Tag.findByIdAndUpdate({_id: id}, {recipe_ids: recipeIds}, {new: true}, (err, result) => {
                        if(err) {
                            console.log(err)
                        }
                        console.log(result)
                    })
                })

                authorIds.forEach(id => {
                    Author.findByIdAndUpdate({_id: id}, {recipe_ids: recipeIds}, {new: true}, (err, result) => {
                        if(err) {
                            console.log(err)
                        }
                        console.log(result)
                    })
                })
            })
            .then(()=>{
                res.send("Success")
            })
}

const addRecipe = async (data) => {
    const addedData = await Recipe.create(data);
    return addedData;
}

const addTaxonomy = async(data, schema) => {

    const formatedData = data.map(item => {
        return {
            name: item
        }
    });

    const addedData = await schema.create(formatedData);
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