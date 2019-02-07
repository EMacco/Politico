import { Router } from 'express';
import UsersController from '../controllers/users';
import Authorization from '../controllers/authorization';

const routes = Router();

// Fetch specific users
routes.get('/:id', Authorization.isUser, UsersController.fetchSpecificUser);

// Delete user by id
routes.delete('/:id', Authorization.isAdmin, UsersController.deleteUser);

export default routes;
