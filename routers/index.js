import express, {json} from 'express';
import {
    paginaInicio,
    paginaNosotros,
    paginaViajes,
    paginaTestimonios,
    paginaDetalleViajes,
    guardarTestimonios,
    crearCuentaUsuario,
    paginaCrearUsuario,
    paginaInicioSesion,
    IniciarSesion,
    CerrarSesion
} from "../controllers/paginaController.js";

const router = express.Router();

router.get("/", paginaInicio);
router.get("/nosotros", paginaNosotros);
router.get("/viajes", paginaViajes);
router.get("/testimonios", paginaTestimonios);
router.get("/viajes/:slug", paginaDetalleViajes);
router.get("/CrearCuentaUsuario", paginaCrearUsuario);
router.get("/iniciosesion", paginaInicioSesion)

router.get("/viajes/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const viaje = await Viaje.findOne({ where: { slug } });

        if (!viaje) {
            return res.redirect("/viajes");
        }

        res.render("viaje", {
            titulo: viaje.titulo,
            resultado: viaje
        });
    } catch (error) {
        console.log(error);
    }
});


router.post("/testimonios", guardarTestimonios);

router.post("/CrearCuentaUsuario", crearCuentaUsuario);

router.post("/iniciosesion", IniciarSesion);
router.get("/cerrarsesion", CerrarSesion);



export default router;