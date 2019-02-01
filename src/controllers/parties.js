import Joi from 'joi';
import politicalParties from '../models/parties';
import { validateParty } from './validationFunctions';

class PartiesController {
  // Get all parties
  static getAllParties(req, res) {
    return res.json({ status: 200, data: politicalParties });
  }
}

export default PartiesController;
