const Router = require('express').Router;
const users = require('../../mock/Users');

class AuthRoutes {
    path;
    router;

    constructor(path) {
        this.router = Router();
        this.path = path;

        this.#init();
    }

    #init() {
        this.router.get('/users', (req, res) => {
            res.json(users)
        });

        this.router.post('/login', (req, res) => {
            const { email } = req.body;
            const foundUser = users.find(user => user.email === email);

            if (!foundUser) {
                const error = 'User not found.';
                res.status(404).send({ error });
            }

            res.send({ user: foundUser });
        })
    }
}

module.exports = AuthRoutes;