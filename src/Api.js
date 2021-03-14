import express from 'express';
import morgan from 'morgan';
import AuthRoutes from './routes/Auth/auth.routes';

class Api {
  constructor(port) {
    if (!port) {
      throw Error('App port not specified.');
    }

    this.middlewares();
    this.loadRoutes();
    this.port = port;
  }

  middlewares() {
    this.express = express();
    this.express.use(express.json());
    this.express.use(morgan('dev'));
  }

  loadRoutes() {
    const authRoutes = new AuthRoutes('/api/auth');
    this.express.use(authRoutes.path, authRoutes.router);
  }

  listen() {
    this.express.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`);
    });
  }
}

export default Api;
