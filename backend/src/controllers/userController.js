const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const boom = require('@hapi/boom');

exports.signUp = async (req, res) => {
    try {
        if (/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i.test(req.body.email))
            throw new Error('Email inválido');
        else if (!req.body.password || req.body.password.length <= 6)
            throw new Error('A senha deve ter mais que 6 caracteres');
        const existingUser = await User.findOne({
            $or: [
                {email: req.body.email},
                {phoneNumber: req.body.phoneNumber},
                {cpf: req.body.cpf}
            ]
        });
        console.log(existingUser)
        if (existingUser) {
            if (existingUser.email === req.body.email)
                throw new Error('Email já registrado');
            else if(existingUser.phoneNumber === req.body.phoneNumber)
                throw new Error('Número de telefone já registrado');
            else
                throw new Error('CPF já registrado');
        } else {
            req.body.phoneNumber = req.body.phoneNumber.replace(/\D/g, '');
            req.body.cpf = req.body.cpf.replace(/\D/g, '');
            req.body.cep = req.body.cep.replace(/\D/g, '');
            const result = await User.create(req.body);
            return {...result._doc, password: null, _id: result.id};
        }
    } catch (err) {
        throw boom.boomify(err);
    }
}

exports.signIn = async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if (!user)
        throw new Error('Usuário não cadastrado');
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isEqual) {
        throw new Error('Senha incorreta');
    }
    const token = jwt.sign({userId: user.id},
        'senhaSecreta',
        {expiresIn: '12h'});
    return {userId: user.id, username: user.name, token: token};
}