import {Viaje} from "../models/Viaje.js";
import moment from 'moment';
import {Testimonial} from "../models/Testimoniales.js";


const paginaInicio = async (req, res) => {

   const promiseDB=[];

    promiseDB.push(Viaje.findAll({limit: 3}));

    promiseDB.push(Testimonial.findAll({
        limit: 3,
        order: [["Id", "DESC"]],
    }));

    //Consultar 3 viajes del modelo de Viaje
    try{
        const resultado = await Promise.all(promiseDB);


        res.render('inicio', {
            titulo: 'Inicio',
            clase: 'home',
            viajes: resultado[0],
            testimonios: resultado[1],
            moment: moment,
        });

    }catch(err){
        console.log(err);
    }


}

const paginaNosotros = (req, res) => {
    const titulo = 'Nosotros';
    res.render('nosotros', {
        titulo,
    });
};

const paginaViajes = async (req, res) => {
    const titulo = 'Viajes';
    const viajes = await Viaje.findAll();

    res.render('viajes', {
        titulo,
        viajes,
    });
};

const paginaTestimonios = async (req, res) => {
    const testimonios = await Testimonial.findAll({
        limit: 6,
        order: [["Id", "DESC"]],
    });
    res.render('testimonios', {
        pagina:'testimonios',
        testimonios: testimonios,
    });
};

const paginaDetalleViajes = async (req, res) => {
    const{slug} = req.params;

    try{
        const resultado = await Viaje.findOne({where:{slug:slug}});

        res.render('viaje', {
            titulo: "Informacion del Viaje",
            resultado,
            moment:moment,
        });

    }catch(err){
        console.log(err);
    }
};
/*
//Muestra una página por su Detalle
const paginaComprar = async (req, res) => {
    // req.params te va a dar los :slug que ponemos al pasarlo del router
    const {slug} = req.params;
    try{
        //Me traigo una sola columna y lo hago con un where donde coincida el slug
        const resultado = await Viaje.findOne({where: {slug: slug}});
        res.render('comprar', {
            pagina: 'Comprar un Viaje',
            resultado: resultado,
            moment: moment,
        })
    }catch (error){
        console.log(error);
    }

}

const guardarCompra =  async (req, res) => {

    const {nombre, apellidos, correo, telefono, slug} = req.body;

    const errores = [];

    if (nombre.trim() === '') {
        errores.push({mensaje: 'El nombre está vacío'});
    }
    if (correo.trim() === '') {
        errores.push({mensaje: 'El correo está vacío'});
    }
    if (telefono.trim() === '') {
        errores.push({mensaje: 'El teléfono está vacío'});
    }
    if (apellidos.trim() === '') {
        errores.push({mensaje: 'Los apellidos están vacío'});
    }




    const resultado2 = await Viaje.findOne({where: {slug: slug}});






    if (errores.length > 0) { //Debemos volver a la vista y mostrar los errores


        res.render('comprar', {
            pagina: 'Comprar un viaje',
            errores: errores,
            nombre: nombre,
            correo: correo,
            apellidos: apellidos,
            telefono: telefono,
            resultado: resultado2,
        })
    } else {//Almacenar el mensaje en la BBDD
        // Crear un objeto de transporte de Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // Usando Gmail como servicio de correo
            auth: {
                user: 'carlosronce@gmail.com', // Reemplaza con tu correo de Gmail
                pass: 'bbsk jush eqad yptu'         // Reemplaza con tu contraseña o una contraseña de aplicación
            }
        });
        try {
            // Crear cliente en la base de datos
            await Cliente.create({
                nombre: nombre,
                apellidos: apellidos,
                correoelectronico: correo,
                telefono: telefono,
            });

            // Configurar el mensaje de correo
            const mailOptions = {
                from: `carlosronce@gmail.com`,      // Remitente
                to: 'croncero@yahoo.es',         // Destinatario
                subject: `Compra realizada por ` + nombre,  // Asunto
                text:
                    'Nombre: ' + nombre + '\n' +
                    'Apellidos: ' + apellidos + '\n' +
                    'Correo: ' + correo + '\n' +
                    'Teléfono: ' + telefono + '\n' +
                    'Viaje: ' + resultado2.titulo + '\n' +
                    'Precio: ' + resultado2.precio + ' euros\n' +
                    'Fecha de ida: ' + resultado2.fecha_ida + '\n' +
                    'Fecha de vuelta: ' + resultado2.fecha_vuelta + '\n' +
                    'Disponibles: ' + resultado2.disponibles + '\n' +
                    'Descripción: ' + resultado2.descripcion  // Contenido del correo
            };


            await transporter.sendMail(mailOptions);
            //res.redirect('/comprar'); //Guardo en la base de datos y lo envío a la misma vista
            res.render('enviarmail.pug', {
                pagina: 'Comprar un viaje',
                correcto: 'si',
                nombre: nombre,
                correo: correo,
                apellidos: apellidos,
                telefono: telefono,
                resultado: resultado2,
            })
        } catch (error) {
            console.log(error);
        }
    }

};
*/

const guardarTestimonios = async (req, res) => {
    console.log(req.body);
    const{nombre, correo, mensaje}=req.body;

    const errores= [];

    if(nombre.trim()===''){
        errores.push({mensaje: 'El nombre está vacio'});
    }

    if(correo.trim()===''){
        errores.push({mensaje: 'El correo esta vacio'});
    }

    if(mensaje.trim()===''){
        errores.push({mensaje: 'El mensaje esta vacio'});
    }

    if(errores.length>0){
        const testimonios = await Testimonial.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });
        res.render('Testimonios', {
            titulo: 'Testimonios',
            errores: errores,
            nombre: nombre,
            correoelectronico: correo,
            mensaje: mensaje,
            testimonios:testimonios
        })
    } else{
        try{
            await Testimonial.create({nombre: nombre, correoelectronico: correo,mensaje: mensaje,});
            res.redirect('/testimonios'); //Guardo en la base de datos y lo envío a la misma vista
        }catch(error){
            console.log(error);
        }
    }
};


export {
    paginaInicio,
    paginaViajes,
    paginaTestimonios,
    paginaNosotros,
    paginaDetalleViajes,
    guardarTestimonios,
    /*guardarCompra,
    paginaComprar,*/
}