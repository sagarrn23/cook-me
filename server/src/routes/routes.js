import { 
    getRecipe,
    addRecipe
} from '../controllers/controller'

const routes = (app) => {
    app.route('/recipes')
        .get((req, res, next) => {
            // middleware
            console.log(`Request from: ${req.originalUrl}`);
            console.log(`Request type: ${req.method}`);
            next();
        }, getRecipe)

        .post(addRecipe);
}

export default routes;