import { Router } from 'express';
import OfficesController from '../controllers/offices';
const routes = Router();

// Fetch all political offices
routes.get('/', OfficesController.getAllOffices);

// Fetch a specific political office
routes.get('/:id', OfficesController.getSingleOffice);

// Create political office
routes.post('/', OfficesController.createPoliticalOffice);

export default routes;
