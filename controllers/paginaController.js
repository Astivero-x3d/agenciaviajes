import {Viaje} from "../models/viaje.js";
import moment from 'moment';
import {Testimonial} from "../models/testimoniales.js";
import {CuentaUsuario} from "../models/cuentausuario.js";

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
            res.redirect('/testimonios');
        }catch(error){
            console.log(error);
        }
    }
};

const paginaCrearUsuario = async(req, res) => {
    const crearelusuario = await CuentaUsuario.findAll({
        limit: 6,
        order: [["Id", "DESC"]],
    });
    res.render('CrearCuentaUsuario', {
        pagina:'CrearCuentaUsuario',
        CrearCuentaUsuario: crearelusuario,
    });
}

const crearCuentaUsuario = async (req, res) => {
    console.log(req.body);

    const {nombre, email, contrasena}=req.body;

    const errores = [];

    if(nombre.trim()===''){
        errores.push({mensaje: 'El nombre esta vacio'});
    }

    if(email.trim()===''){
        errores.push({mensaje: 'El email vacio'});
    }

    if(contrasena.trim()===''){
        errores.push({mensaje: 'El contrasena esta vacio'});
    }

    if(errores.length>0){
        const crearcuentausuario = await CuentaUsuario.findAll({
            limit: 6,
            order: [["Id", "DESC"]],
        });
        res.render('crearcuentausuario', {
            titulo: 'Crearcuenta',
            errores: errores,
            nombre: nombre,
            email: email,
            contrasena: contrasena,
            crearcuentausuario: crearcuentausuario
        })
    } else{
        try{
            await CuentaUsuario.create({nombre: nombre, email: email, contrasena: contrasena});
            res.redirect('/CrearCuentaUsuario');
        } catch(error){
            console.log(error);
        }
    }
};

const paginaInicioSesion = async (req, res) => {
    const iniciarlacuentasesion = await CuentaUsuario.findAll({
        limit: 6,
        order: [["Id", "DESC"]],
    });
    res.render('iniciosesion', {
        pagina:'iniciosesion',
        iniciosesion: iniciarlacuentasesion,
    });
}

const IniciarSesion = async (req, res) => {
    const {email, contrasena} = req.body;

    if (!email || !contrasena) {
        return res.render('iniciosesion', {
            titulo: 'Inicio de Sesión',
            error: 'Todos los campos son obligatorios',
        });
    }

    try{
        const usuario = await CuentaUsuario.findOne({where: {email}});

        if (!usuario || usuario.contrasena !== contrasena) {
            return res.render('iniciosesion', {
                titulo: 'Inicio de Sesión',
                error: 'Correo o contraseña incorrectos',
            });
        }

        req.session.usuario = usuario.nombre;

        res.redirect('/');
    }  catch (error) {
        console.log(error);
        res.render('iniciosesion', {
            titulo: 'Inicio de Sesión',
            error: 'Hubo un error, intenta nuevamente',
        });
    }
}

const CerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};



export {
    paginaInicio,
    paginaViajes,
    paginaTestimonios,
    paginaNosotros,
    paginaDetalleViajes,
    guardarTestimonios,
    paginaCrearUsuario,
    crearCuentaUsuario,
    paginaInicioSesion,
    IniciarSesion,
    CerrarSesion
};