import express from 'express';
import cors from 'cors';
import socketIo from 'socket.io';
import morgan from 'morgan';
import AuthRoutes from './routes/Auth/auth.routes';

class Api {
    #express = express();
    #server;
    #io;
    port;

    constructor(port) {
        if (!port) {
            throw Error('App port not specified.');
        }

        this.port = port;
        this.#middlewares();
        this.#loadRoutes();
        this.#loadSocketIoServer();
    }

    #middlewares() {
        this.#express.use(express.json());
        this.#express.use(express.urlencoded({ extended: true }));
        this.#express.use(morgan('dev'));
        // this.#express.use(cors({
        //     origin: 'http://localhost:3000',
        //     methods: ['GET', 'POST']
        // }));
        // this.#express.use(cors());
        // this.#express.use((req, res, next) => {
        //     res.header('Access-Control-Allow-Origin', '*');
        //     res.header('Access-Control-Allow-Headers', 'Content-Type');
        //     this.#express.use(cors());
        //     next();
        // });
    }

    #loadRoutes() {
        const authRoutes = new AuthRoutes('/api/auth');
        this.#express.use(authRoutes.path, authRoutes.router);
    }

    #loadSocketIoServer() {
        this.#server = this.#express.listen(this.port, () => {
            console.log('Listening on port', this.port);
        });

        this.#io = socketIo(this.#server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
              }
        });
        this.#io.on('connection', (socket) => {
            console.log('Id conectado: ', socket.id);

            socket.on('message', (payload) => {
                console.log('payload: ', payload);
                socket.broadcast.emit('message');
            })

            socket.on('disconnect', () => {
                console.log('Desconectou')
            })
        });
    }

    // listen() {
    //     this.#express.listen(this.port, () => {
    //         console.log('Listening on port', this.port);
    //     });
    // }
}

export default Api;