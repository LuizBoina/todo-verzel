const bcrypt = require('bcrypt');
const moongose = require('mongoose');

const UserSchema = new moongose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    birthday: { type: Date, require: true },
    cpf: { type: String },
    cep: { type: String },
    address: { type: String },
    addressNumber: { type: String },
    phoneNumber: { type: String },
    password: { type: String, require: true },
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.hash(this.password, 9).then((hash) => {
        this.password = hash;
        next();
    }).catch(next);
});

UserSchema.methods = {
    authenticate(password) {
        return bcrypt.compare(password, this.password).then((valid) => valid ? this : false);
    }
};

module.exports = moongose.model('User', UserSchema);