import mongoose from 'mongoose';
import { 
    RecipeSchema,
    TaxonomySchema,
} from '../models/model';

mongoose.set('useFindAndModify', false);


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

    const author = inputData.author;
    const addedAuthor = addTaxonomy(author, Author);
    const addedCollections = [addedRecipe, addedCategories, addedTags, addedAuthor];
    updateRelations(addedCollections, res);
}

const updateRelations = (addedCollections, res) => {
    Promise.all([...addedCollections])
            .then(response => {
                const recipeIds = response[0]._id;
                const catIds = response[1];
                const tagIds = response[2];
                const authorId = response[3]._id;

                const updateRecipeTax = (ids, id_title) => {
                    Promise.all([...ids]).then(resp => {
                        const taxIds = resp.map(taxId=> taxId._id);
                        Recipe.findByIdAndUpdate(
                            {_id: recipeIds}, 
                            {   
                                [id_title]: taxIds
                            }, 
                            {new: true, upsert: true}, 
                            (err, result) => {
                                if(err) {
                                    console.log(err)
                                }
                            }
                        );
                    })
                }
                updateRecipeTax(catIds, 'category_ids')
                updateRecipeTax(tagIds, 'tag_ids')

                Recipe.findByIdAndUpdate(
                    {_id: recipeIds}, 
                    {
                        author_ids: authorId
                    }, 
                    {new: true}, 
                    (err, result) => {
                        if(err) {
                            console.log(err)
                        }
                    }
                );

                catIds.forEach(catId => {
                    catId.then(cat => {
                        Category.findByIdAndUpdate({_id: cat._id}, {$addToSet:{recipe_ids: recipeIds}}, {new: true, upsert: true}, (err, result) => {
                            if(err) {
                                console.log(err)
                            }
                        })
                    })
                })

                tagIds.forEach(tagId => {
                    tagId.then(tag => {
                        Tag.findByIdAndUpdate({_id: tag._id}, {$addToSet:{recipe_ids: recipeIds}}, {new: true, upsert: true}, (err, result) => {
                            if(err) {
                                console.log(err)
                            }
                        })
                    })
                })

                Author.findByIdAndUpdate({_id: authorId}, {$addToSet:{recipe_ids: recipeIds}}, {new: true, upsert: true}, (err, result) => {
                    if(err) {
                        console.log(err)
                    }
                })
            })
            .then(()=>{
                res.send("Success")
            })
}

const addRecipe = async (data) => {
    if('id' in data) {
        const updatedData = await Recipe.findByIdAndUpdate({_id: data.id}, data, {new: true}, (err, result) => {
            return result;
        });
        return updatedData;
    } else {
        const addedData = await Recipe.create(data);
        return addedData;
    }
}

const addTaxonomy = async(data, schema) => {
    const formatedData = () => {
        if(!Array.isArray(data)) {
            return data
        }
        return data.map(item => {
            return item
        })
    };

    if(Array.isArray(formatedData())){
        const addedData = formatedData().map(async(item) => {
            if('id' in item) {
                const updatedData = await schema.findByIdAndUpdate({_id: item.id}, item, {new: true}, (err, result) => {
                    return result;
                });
                return updatedData;
            } else {
                const newData = await schema.create(item);
                return newData;
            }
        })
        return addedData;
    } else {
        const authorData = formatedData()

        if('id' in authorData) {
            const updatedData = await schema.findByIdAndUpdate({_id: authorData.id}, authorData, {new: true}, (err, result) => {
                return result;
            });
            return updatedData;
        } else {
            const newData = await schema.create(authorData);
            return newData;
        }
    }
}

export const getRecipe = (req, res) => {
    Recipe.find({}, (err, recipe) => {
        if(err) {
            res.send(err);
        }
        res.json(recipe);
    });
}