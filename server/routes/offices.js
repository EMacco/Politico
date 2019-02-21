import { Router } from 'express';
import OfficesController from '../controllers/offices';
import Authorization from '../controllers/authorization';

const routes = Router();

// Fetch all political offices
routes.get('/', Authorization.isUser, OfficesController.getAllOffices);

// Fetch all candidates
routes.get('/candidates', Authorization.isUser, OfficesController.getAllCandidates);

// Fetch a specific political office
routes.get('/:id', Authorization.isUser, OfficesController.getSingleOffice);

// Create political office
routes.post('/', Authorization.isAdmin, OfficesController.createPoliticalOffice);

// Delete a particular office
routes.delete('/:id', Authorization.isAdmin, OfficesController.deletePoliticalOffice);

// Edit particular political office
routes.patch('/:id/name', Authorization.isAdmin, OfficesController.editParticularPoliticalOffice);
routes.patch('/:id/type', Authorization.isAdmin, OfficesController.editOfficeType);

export default routes;
