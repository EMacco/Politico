import { Router } from 'express';
import OfficeController from '../controllers/office';
import Authorization from '../controllers/authorization';

const routes = Router();

// Register new election candidate
routes.post('/:candidateId/register', Authorization.isAdmin, OfficeController.registerCandidate);

export default routes;
