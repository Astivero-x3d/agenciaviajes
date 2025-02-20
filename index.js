import express, {json} from 'express';
import router from './routers/index.js';
import db from './config/db.js';
import  dotenv from 'dotenv';
import session from 'express-session';
dotenv.config();


const app = express();


//Conectar a la BBDD
db.authenticate()
    .then(()=> console.log('Conectado a la base de datos'))
    .catch(err=>console.log(err));


const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`Escuchando en el puerto ${port}`));

//Habilitar pug
app.set('view engine', 'pug');

app.use((req,res,next) => {
    const year = new Date().getFullYear();
    res.locals.year = year;
    res.locals.nombreP  = 'Agencia de Viajes';
    next();
});

//Definir la carpeta publica
app.use(express.static('public'));

//Agregar body parser para los formularios de entrada
app.use(express.urlencoded({extended: true}));

//InicioDeSesion
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    next();
});


app.use("/", router);

//"dev": "nodemon index.js"