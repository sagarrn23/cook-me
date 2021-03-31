import express from 'express';
import routes from './src/routes/routes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/recipeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(`Node and express running on port ${PORT}`)
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})