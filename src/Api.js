const express = require('express');
const morgan = require('morgan');
const AuthRoutes = require('./routes/Auth/auth.routes');

class Api {
    #express = express();
    port;

    constructor(port) {
        if (!port) {
            throw Error('App port not specified.');
        }

        this.#middlewares();
        this.#loadRoutes();
        this.port = port;
    }

    #middlewares() {
        this.#express.use(express.json());
        this.#express.use(morgan('dev'));
    }

    #loadRoutes() {
        const authRoutes = new AuthRoutes('/api/auth');
        this.#express.use(authRoutes.path, authRoutes.router);
    }

    listen() {
        this.#express.listen(this.port, () => {
            console.log('Listening on port ' + this.port);
        });
    }
}

module.exports = Api;