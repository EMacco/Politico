import { Router } from 'express';
import PartiesController from '../controllers/parties';

const routes = Router();

// Get a list of all political parties
routes.get('/', PartiesController.getAllParties);

// Get a specific political party
routes.get('/:id', PartiesController.getSingleParty);

export default routes;
