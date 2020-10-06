const bcrypt = require("bcryptjs");
const cryptoRandonString = require('crypto-random-string')

module.exports = {

    hash_pass: (req, res, next) => {
        b = req.body

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(b.password, salt, function (err, hash) {
                if (err) next(err)
                if (req.body.password) req.body.password = hash
                return next()
            });
        });
    },

    generate_random_url_string : (req, res, next) => {
        req.token = cryptoRandomString({ length: 10, type: 'url-safe' });
        next (); 
    }



}   