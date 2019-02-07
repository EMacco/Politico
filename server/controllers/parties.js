import Joi from 'joi';
import PartiesModel from '../models/parties';
import { validateParty } from './validationFunctions';

class PartiesController {
  // Get all parties
  static getAllParties(req, res) {
    PartiesModel.fetchAllParties(({ success, data }) => {
      // Check if the query was successful
      if (success) {
        return res.status(200).json({ status: 200, data });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
    return null;
  }

  static getSingleParty(req, res) {
    PartiesModel.fetchPartyById(parseInt(req.params.id, 10), ({ success, data }) => {
      // Check if the query was successful
      if (success) {
        // Check if the party exists

        if (data.length === 0)
          return res.status(404).json({ status: 404, error: 'The political party does not exist' });

        // The party exists retrun to the user
        return res.status(200).json({ status: 200, data: [data] });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
    return null;
  }

  static createPoliticalParty(req, res) {
    // Validate the party details
    const { error } = validateParty(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    // Remove white spaces
    req.body.name = req.body.name.replace(/\s\s+/g, ' ').trim();
    req.body.hqAddress = req.body.hqAddress.replace(/\s\s+/g, ' ').trim();


    // Check if the party exists before
    PartiesModel.fetchPartyByName(req.body.name, ({ success, data }) => {
      if (!success) {
        // It is a server error
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if the party exists
      if (data.length !== 0)
        // The party already exists
        return res.status(409).json({ status: 409, error: 'This political party already exists' });

      // Create the new party
      const newParty = {
        name: req.body.name,
        hqAddress: req.body.hqAddress,
        logoUrl: req.body.logoUrl
      };

      //   Insert the new party in the array
      PartiesModel.createNewParty(newParty, ({ successs, dataa }) => {
        if (successs) {
          // Return the new user details to the user
          return res.status(201).json({ status: 201, data: dataa });
        }
        return res.status(500).json({ status: 500, error: dataa });
      });
      return null;
    });
    return null;
  }

  static deletePoliticalParty(req, res) {
    // Check if the party exists
    PartiesModel.fetchPartyById(parseInt(req.params.id, 10), ({ success, data }) => {
      if (!success) {
        // It is a server error
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if the party exists
      if (data.length === 0) {
        return res.status(404).json({ status: 404, error: 'Party does not exist' });
      }

      // Delete from server
      PartiesModel.deletePartyById(parseInt(req.params.id, 10), ({ successs }) => {
        if (!successs) {
          return res.status(500).json({ status: 500, error: data });
        }

        return res.status(200).json({ status: 200, data });
      });
      return null;
    });
    return null;
  }

  static editParticularPoliticalParty(req, res) {
    // Validate the name
    const schema = {
      name: Joi.string()
        .min(5)
        .max(40)
        .required(),
      id: Joi.number().required()
    };
    const { error } = Joi.validate({ name: req.body.name, id: req.params.id }, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    // Remove white spaces
    req.body.name = req.body.name.replace(/\s\s+/g, ' ').trim();

    PartiesModel.fetchPartyById(parseInt(req.params.id, 10), ({ success, data }) => {
      if (!success) {
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if there is party
      if (data.length === 0) {
        return res.status(404).json({ status: 404, error: 'Party does not exist' });
      }

      // Update the party
      PartiesModel.updatePartyNameById(req.params.id, req.body.name, ({ successs, dataa }) => {
        if (successs) {
          // Return the new user details to the user
          return res.status(200).json({ status: 200, data: dataa });
        }
        return res.status(500).json({ status: 500, error: dataa });
      });
      return null;
    });
    return null;
  }

  static editPartyAddress(req, res) {
    // Validate the name
    const schema = {
      hqAddress: Joi.string()
        .min(10)
        .max(100)
        .required(),
      id: Joi.number().required()
    };
    const { error } = Joi.validate({ hqAddress: req.body.hqAddress, id: req.params.id }, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    // Remove white spaces
    req.body.hqAddress = req.body.hqAddress.replace(/\s\s+/g, ' ').trim();

    PartiesModel.fetchPartyById(parseInt(req.params.id, 10), ({ success, data }) => {
      if (!success) {
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if there is party
      if (data.length === 0) {
        return res.status(404).json({ status: 404, error: 'Party does not exist' });
      }

      // Update the party
      PartiesModel.updatePartyAddressById(
        req.params.id,
        req.body.hqAddress,
        ({ successs, dataa }) => {
          if (successs) {
            // Return the new user details to the user
            return res.status(200).json({ status: 200, data: dataa });
          }
          return res.status(500).json({ status: 500, error: dataa });
        }
      );
      return null;
    });
    return null;
  }
}

export default PartiesController;
