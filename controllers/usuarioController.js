const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearUsuario = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    // Extraer email y password

    const { email, password } = req.body;

    try {
        //Revisar que el user sea unico
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: "El usuario ya existe" })
        }

        //Crea nuevo usuario
        usuario = new Usuario(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //Guardar usuario
        await usuario.save();

        // Crear y firmar el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000
        }, (error,token) => {
            if(error) throw error;  
            //Mensaje de confirmacion
            res.json({ token })
        });


    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}