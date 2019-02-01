import { Router } from 'express';
import OfficesController from '../controllers/offices';
const routes = Router();

// Fetch all political offices
routes.get('/', OfficesController.getAllOffices);

// Fetch a specific political office
routes.get('/:id', OfficesController.getSingleOffice);

// Create political office
routes.post('/', OfficesController.createPoliticalOffice);

// Delete a particular office
routes.delete('/:id', OfficesController.deletePoliticalOffice);

// Edit particular political office
routes.patch('/:id/:name', OfficesController.editParticularPoliticalOffice);

export default routes;
