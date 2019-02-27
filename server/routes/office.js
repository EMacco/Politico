import { Router } from 'express';
import OfficeController from '../controllers/office';
import Authorization from '../controllers/authorization';

const routes = Router();

// Schedule election
routes.post('/schedule', Authorization.isAdmin, OfficeController.scheduleElection);

// Register new election candidate
routes.post('/:candidateId/register', Authorization.isUser, OfficeController.registerCandidate);

// Get all the votes for this office
routes.get('/:officeId/office-votes', Authorization.isUser, OfficeController.fetchVotesForOffice);

// Get all the votes for this user
routes.get('/:userId/user-votes', Authorization.isUser, OfficeController.fetchVotesForUser);

// Fetch result for specific office
routes.post('/:officeId/result', Authorization.isUser, OfficeController.collateResult);

// Delete interest
routes.delete('/:userId/delete-interest', Authorization.isUser, OfficeController.declineInterest);

export default routes;
