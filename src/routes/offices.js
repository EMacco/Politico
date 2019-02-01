import { Router } from 'express';
import OfficesController from '../controllers/offices';
const routes = Router();

// Fetch all political offices
routes.get('/', OfficesController.getAllOffices);

export default routes;
