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

  static createPoliticalParty(req, res) {
    // Validate user input
    const { error } = validateParty(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    // The data is valid create it and return
    const newParty = {
      id: politicalParties.length + 1,
      name: req.body.name,
      hqAddress: req.body.hqAddress,
      logoUrl: req.body.logoUrl
    };

    //   Insert the new office in the array
    politicalParties.push(newParty);

    return res.status(201).json({ status: 201, data: [newParty] });
  }

  static deletePoliticalParty(req, res) {
    // Check if the party exists
    const partyFound = politicalParties.find(party => party.id === parseInt(req.params.id, 10));

    if (!partyFound) return res.status(404).json({ status: 404, error: 'Party does not exist' });

    // Delete the party
    const index = politicalParties.indexOf(partyFound);
    politicalParties.splice(index, 1);

    // Return deleted value
    return res.status(200).json({ status: 200, data: [partyFound] });
  }

  static editParticularPoliticalParty(req, res) {
    // Check if the party exists
    const partyFound = politicalParties.find(party => party.id === parseInt(req.params.id, 10));

    if (!partyFound) return res.status(404).json({ status: 404, error: 'Party does not exist' });

    // Validate the name
    const schema = {
      name: Joi.string()
        .min(10)
        .required()
        .trim()
        .strict()
    };
    const { error } = Joi.validate({ name: req.params.name }, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    // Find the index of the party in the array
    const partiesIndexes = politicalParties.map(party => party.id);
    const updateIndex = partiesIndexes.indexOf(parseInt(req.params.id, 10));

    //   Update data in database
    politicalParties[updateIndex].name = req.params.name;

    return res.status(200).json({ status: 200, data: [politicalParties[updateIndex]] });
  }
}

export default PartiesController;
