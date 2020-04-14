const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    //Extraer user y pw del request
    const { email, password } = req.body;

    try {
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) res.status(400).json({ msg: 'Password incorrecto' });

        //Si todo es correcto
        // Crear y firmar el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600000
        }, (error, token) => {
            if (error) throw error;
            //Mensaje de confirmacion
            res.json({ token });

        });

    } catch (error) {
        console.log(error);
    }

}

// Obtiene el usuario que esta autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
        console.log(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'HUbo error' })
    }
}