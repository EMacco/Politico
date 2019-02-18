import { Router } from 'express';
import OfficeController from '../controllers/office';
import Authorization from '../controllers/authorization';

const routes = Router();

// Register new election candidate
routes.post('/:candidateId/register', Authorization.isUser, OfficeController.registerCandidate);

// Fetch result for specific office
routes.post('/:officeId/result', Authorization.isUser, OfficeController.collateResult);

export default routes;
