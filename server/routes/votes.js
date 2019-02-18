import { Router } from 'express';
import VotesController from '../controllers/votes';
import Authorization from '../controllers/authorization';

const routes = Router();

// Register new election candidate
routes.post('/', Authorization.isUser, VotesController.registerVote);

export default routes;
