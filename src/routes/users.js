import { Router } from 'express';
import UsersController from '../controllers/users';
const routes = Router();

// Fetch specific users
routes.get('/:id', UsersController.fetchSpecificUser);

// User registration
routes.post('/auth/signup', UsersController.createUsers);

// Delete user by id
routes.delete('/:id', UsersController.deleteUser);

// User Login

export default routes;
