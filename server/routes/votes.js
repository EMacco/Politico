import { Router } from 'express';
import VotesController from '../controllers/votes';
import Authorization from '../controllers/authorization';

const routes = Router();

// Cast user vote
routes.post('/', Authorization.isUser, VotesController.registerVote);

export default routes;
