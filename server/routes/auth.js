import { Router } from 'express';
import UsersController from '../controllers/users';

const routes = Router();

// User registration
routes.post('/signup', UsersController.createUsers);

// User Login
routes.post('/login', UsersController.loginUser);

export default routes;
