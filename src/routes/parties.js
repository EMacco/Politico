import { Router } from 'express';
import PartiesController from '../controllers/parties';

const routes = Router();

// Get a list of all political parties
routes.get('/', PartiesController.getAllParties);

// Get a specific political party
routes.get('/:id', PartiesController.getSingleParty);

// Create political party
routes.post('/', PartiesController.createPoliticalParty);

// Delete a particular party
routes.delete('/:id', PartiesController.deletePoliticalParty);

// Edit particular political party
routes.patch('/:id/:name', PartiesController.editParticularPoliticalParty);

export default routes;
