import express, {json} from 'express';
import router from './routers/index.js';
import db from './config/db.js';
import  dotenv from 'dotenv';
dotenv.config();


const app = express();

const port = process.env.PORT || 4000;

//Conectar a la BBDD
db.authenticate()
    .then(()=> console.log('Conectado a la base de datos'))
    .catch(err=>console.log(err));

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

app.use("/", router);
