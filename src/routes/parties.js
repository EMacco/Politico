import { Router } from 'express';
import PartiesController from '../controllers/parties';

const routes = Router();

// Get a list of all political parties
routes.get('/', PartiesController.getAllParties);

export default routes;
