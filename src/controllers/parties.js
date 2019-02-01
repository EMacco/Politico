import Joi from 'joi';
import politicalParties from '../models/parties';
import { validateParty } from './validationFunctions';

class PartiesController {
  // Get all parties
  static getAllParties(req, res) {
    return res.json({ status: 200, data: politicalParties });
  }

  static getSingleParty(req, res) {
    // Make sure that the id exists in the database
    const foundParty = politicalParties.find(party => party.id === parseInt(req.params.id, 10));

    if (!foundParty)
      return res.status(404).json({ status: 404, error: 'The political party does not exist' });

    // The party exists return party details
    return res.status(200).json({ status: 200, data: [foundParty] });
  }
}

export default PartiesController;
