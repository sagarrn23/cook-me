import mongoose, { Collection } from 'mongoose';
import { 
    RecipeSchema,
    TaxonomySchema,
    IngredientSchema
} from '../models/model';

import mongoosePaginate from 'mongoose-paginate-v2';

mongoose.set('useFindAndModify', false);


RecipeSchema.plugin(mongoosePaginate);

const Recipe = mongoose.model('Recipe', RecipeSchema, 'recipes');
const Category = mongoose.model('Category', TaxonomySchema, 'categories');
const Tag = mongoose.model('Tag', TaxonomySchema, 'tags');
const Author = mongoose.model('Author', TaxonomySchema, 'authors');
const Ingredient = mongoose.model('Ingredient', IngredientSchema, 'ingredients');

// this function creates the document in respective collestion
export const createRecipeHandler = (req, res) => {
    const inputData = req.body;
    const addedRecipe = addRecipe(inputData);
    
    const categories = inputData.categories;
    const addedCategories = addTaxonomy(categories, Category);

    const tags = inputData.tags;
    const addedTags = addTaxonomy(tags, Tag);

    const author = inputData.author;
    const addedAuthor = addTaxonomy(author, Author);

    const ingredients = inputData.ingredients;
    const addedIngredients = addIngredient(ingredients, Ingredient);

    // after successful adding data to collection update relations between them
    const addedCollections = [addedRecipe, addedCategories, addedTags, addedAuthor, addedIngredients];
    updateRelations(addedCollections, res);
}

// update many to many relations
const updateRelations = (addedCollections, res) => {
    Promise.all([...addedCollections])
            .then(async(response) => {
                const recipeIds = response[0]._id;
                const catIds = response[1];
                const tagIds = response[2];
                const authorId = response[3]._id;
                const ingredientIds = response[4].map(ingredient => ingredient._id);

                
                await updateRecipeTax(catIds, 'category_ids', Category, recipeIds)
                await updateRecipeTax(tagIds, 'tag_ids', Tag, recipeIds)
                await addUpdateIngredient(ingredientIds, 'ingredient_ids', recipeIds)

                

                // update recipe collection document author
                await Recipe.findByIdAndUpdate(
                    {_id: recipeIds}, 
                    {
                        author_ids: authorId
                    }, 
                    {new: true}, 
                    (err, result) => {
                        if(err) {
                            console.log(err)
                        }
                        // console.log("Result"+result);
                        Recipe.findById(recipeIds, (err, doc)=>{
                            // console.log("doc"+doc);
                            deletUnwantedRelations(result['author_ids'], doc['author_ids'], recipeIds, Author);
                        })
                    }
                );

                // update recipe ids in category collection document
                await catIds.forEach(catId => {
                    catId.then(cat => {
                        Category.findByIdAndUpdate({_id: cat._id}, {$addToSet:{recipe_ids: recipeIds}}, {new: true, upsert: true}, (err, result) => {
                            if(err) {
                                console.log(err)
                            }
                            // console.log("inside");
                        })
                    })
                })

                // update recipe ids in tag collection document
                await tagIds.forEach(tagId => {
                    tagId.then(tag => {
                        Tag.findByIdAndUpdate({_id: tag._id}, {$addToSet:{recipe_ids: recipeIds}}, { upsert: true}, (err, result) => {
                            if(err) {
                                console.log(err)
                            }
                            // console.log("inside");
                        })
                    })
                })

                // update recipe ids in author collection document
                await Author.findByIdAndUpdate({_id: authorId}, {$addToSet:{recipe_ids: recipeIds}}, {new: true, upsert: true}, (err, result) => {
                    if(err) {
                        console.log(err)
                    }
                    // console.log(result);
                })
                return recipeIds;
            })
            .then(async(id) => {
                // console.log(data);
                const recipe = await Recipe.findById(id).exec();
                const responseData = getResponseData(recipe);
                responseData.then(finalData => {
                    res.send(finalData);
                })
            })
}

// create or update recipe collection document
const addRecipe = async (data) => {
    if('_id' in data) {
        console.log(data._id);
        const updatedData = await Recipe.findByIdAndUpdate({_id: data._id}, data, {new: true}, (err, result) => {
            return result;
        });
        return updatedData;
    } else {
        const addedData = await Recipe.create(data);
        return addedData;
    }
}

// create or update category, tag, author collection document
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
            if('_id' in item) {
                const updatedData = await schema.findByIdAndUpdate({_id: item._id}, item, {new: true}, (err, result) => {
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

        if('_id' in authorData) {
            const updatedData = await schema.findByIdAndUpdate({_id: authorData._id}, authorData, {new: true}, (err, result) => {
                return result;
            });
            return updatedData;
        } else {
            const newData = await schema.create(authorData);
            return newData;
        }
    }
}

// create or update ingredient Collection document
const addIngredient = async(data, schema) => {
    if('_id' in data) {
        const updatedData = await schema.findByIdAndUpdate({_id: data.id}, data, {new: true}, (err, result) => {
            return result;
        });
        return updatedData;
    } else {
        const addedData = await schema.create(data);
        return addedData;
    }
}

//update recipe colletion document tags and categories
const updateRecipeTax = (ids, tax_id_title, schema, recipeIdss) => {
    Promise.all([...ids]).then(resp => {
        const taxIds = resp.map(taxId=> taxId._id);
        Recipe.findByIdAndUpdate(
            {_id: recipeIdss}, 
            {   
                [tax_id_title]: taxIds
            }, 
            {upsert: true}, 
            (err, result) => {
                if(err) {
                    console.log(err)
                }
                // console.log("Result"+result);
                Recipe.findById(recipeIdss, (err, doc)=>{
                    // console.log("doc"+doc);
                    deletUnwantedRelations(result[tax_id_title], doc[tax_id_title], recipeIdss, schema);
                })
            }
        );
    })
}

const addUpdateIngredient = (ids, tax_id_title, recipeIdss) => {
    const ingredientIds = ids;
    console.log(ingredientIds);
    Recipe.findByIdAndUpdate(
        {_id: recipeIdss}, 
        {   
            [tax_id_title]: ingredientIds
        }, 
        {upsert: true}, 
        (err, result) => {
            if(err) {
                console.log(err)
            }
        }
    );
}

const deletUnwantedRelations = (oldId, newId, recipeId, schema) => {
    const removeIds = () => {
        if(oldId.length) {
            return oldId.filter(x => !newId.includes(x))
        } else {
            return []
        };
    }

    if(removeIds().length) {
        removeIds().forEach(removeId => {
            console.log(removeId);
            schema.findByIdAndUpdate({_id: removeId}, {$pull:{recipe_ids: recipeId}}, {new: true, upsert: true}, (err, result) => {
                if(err) {
                    console.log(err)
                }
                console.log(result);
            })
        })
    }
}

// delete recipe and update the recipe relation in tax collection documents
export const deleteRecipe = (req, res) => {
    const taxSchemas = [Category, Tag, Author];

    Recipe.findByIdAndRemove(req.body.id, (err, doc) => {
        if(err) {
            res.send(err)
        } else {
            taxSchemas.forEach(schema => {
                const taxIds = () => {
                    if(schema === Category) return doc.category_ids;
                    if(schema === Tag) return doc.tag_ids;
                    if(schema === Author) return doc.author_ids;
                }
                
                [...taxIds()].forEach(taxId => {
                    schema.findByIdAndUpdate({_id: taxId}, {$pull:{recipe_ids: doc._id}}, {new: true, upsert: true}, (err, result) => {
                        if(err) {
                            console.log(err)
                        }
                        console.log(result);
                    })
                })
            })
        }

        console.log(doc);
    })
}

export const getRecipe = (req, res) => {

    const options = {
        page: 1,
        limit: 10,
        sort: 'asc'
    }

    // Recipe.paginate

    Recipe.paginate({}, options, (err, result) => {
        const responseData = result.docs.map(recipe => getResponseData(recipe));
        Promise.all([...responseData]).then(finalData => {
            result.docs = finalData;
            res.send(result);
        })
    })
}

// data to send for get response
const getResponseData = async(inputData) => {
    const catPromise = await inputData.category_ids.map(async(id) => {
        const catData = await Category.findById(id, 'name _id').exec();
        return catData;
    });

    const tagPromise = await inputData.tag_ids.map(async(id) => {
        const tagData = await Tag.findById(id, 'name _id').exec();
        return tagData;
    });

    const authorPromise = await [inputData.author_ids].map(async(id) => {
        const authorData = await Author.findById(id, 'name _id').exec();
        return authorData;
    });

    const ingredientPromise = await inputData.ingredient_ids.map(async(id) => {
        const ingredientData = await Ingredient.findById(id, 'name _id qty unit').exec();
        return ingredientData;
    });

    const catInfo = await Promise.all([...catPromise]).then(info => info);
    const tagInfo = await Promise.all([...tagPromise]).then(info => info);
    const authorInfo = await Promise.all([...authorPromise]).then(info => info);
    const ingredientInfo = await Promise.all([...ingredientPromise]).then(info => info);

    return {
        _id: inputData._id,
        name: inputData.name,
        directions: inputData.directions,
        time_created: inputData.time_created,
        time_updated: inputData.time_updated,
        benefits: inputData.benefits,
        special_notes: inputData.special_notes,
        food_type: inputData.food_type,
        categories: catInfo,
        tags: tagInfo,
        author: authorInfo,
        ingredient_ids: ingredientInfo,
        feature_image: 'http://localhost:3001/images/feature_image.jpg',
        gallary: [
            'http://localhost:3001/images/image1.jpg',
            'http://localhost:3001/images/image2.jpg',
            'http://localhost:3001/images/image3.jpg',
            'http://localhost:3001/images/image4.jpg',
            'http://localhost:3001/images/image5.jpg'
        ]
    };
}