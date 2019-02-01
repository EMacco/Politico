import { Router } from 'express';
import UsersController from '../controllers/users';
const routes = Router();

// Fetch specific users
routes.get('/:email', UsersController.fetchSpecificUser);

// Write the Endpoint for validating user for login

export default routes;
