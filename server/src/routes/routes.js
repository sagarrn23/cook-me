import { 
    getRecipe,
    createRecipeHandler
} from '../controllers/controller'

const routes = (app) => {
    app.route('/recipes')
        .get((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            next();
        }, getRecipe)

        .post(createRecipeHandler)

        .put(createRecipeHandler);
}

export default routes;

// https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/