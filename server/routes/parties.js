import { Router } from 'express';
import PartiesController from '../controllers/parties';
import Authorization from '../controllers/authorization';

const routes = Router();

// Get a list of all political parties
routes.get('/', Authorization.isUser, PartiesController.getAllParties);

// Get a specific political party
routes.get('/:id', Authorization.isUser, PartiesController.getSingleParty);

// Create political party
routes.post('/', Authorization.isAdmin, PartiesController.createPoliticalParty);

// Delete a particular party
routes.delete('/:id', Authorization.isAdmin, PartiesController.deletePoliticalParty);

// Edit particular political party
routes.patch('/:id/name', Authorization.isAdmin, PartiesController.editParticularPoliticalParty);
routes.patch('/:id/address', Authorization.isAdmin, PartiesController.editPartyAddress);

export default routes;
