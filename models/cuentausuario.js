import Sequelize from "sequelize";
import db from "../config/db.js";

export const CuentaUsuario = db.define("CuentaUsuario", {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    contrasena: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

CuentaUsuario.sync({alter:true}).catch(console.error);