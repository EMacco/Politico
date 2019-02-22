import Joi from 'joi';
import jwt from 'jsonwebtoken';
import PartiesModel from '../models/parties';
import UsersModel from '../models/users';
import Authorization from './authorization';
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
        return res.status(200).json({ status: 200, data });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
    return null;
  }

  static createPoliticalParty(req, res) {
    // Remove white spaces
    try {
      if (req.body.name) {
        req.body.name = req.body.name
          .replace(/\s\s+/g, ' ')
          .trim()
          .toLowerCase();
      }

      // Remove white spaces
      if (req.body.hqAddress) {
        req.body.hqAddress = req.body.hqAddress
          .replace(/\s\s+/g, ' ')
          .trim()
          .toLowerCase();
      }
    } catch (error) {}

    // Validate the party details
    const { error } = validateParty(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

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
        .required()
        .label('Please enter name that contains 5 - 40 characters'),
      id: Joi.number()
        .required()
        .label('Please enter ID as a number')
    };

    // Remove white spaces
    try {
      if (req.body.name) {
        req.body.name = req.body.name
          .replace(/\s\s+/g, ' ')
          .trim()
          .toLowerCase();
      }
    } catch (error) {}

    const { error } = Joi.validate({ name: req.body.name, id: req.params.id }, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

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
        .required()
        .label('Please enter HQ address that contains 10 - 100 characters'),
      id: Joi.number()
        .required()
        .label('Please enter ID as a number')
    };

    // Remove white spaces
    try {
      if (req.body.hqAddress) {
        req.body.hqAddress = req.body.hqAddress
          .replace(/\s\s+/g, ' ')
          .trim()
          .toLowerCase();
      }
    } catch (error) {}

    const { error } = Joi.validate({ hqAddress: req.body.hqAddress, id: req.params.id }, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

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

  static joinParty(req, res) {
    // Get the id of the user that is signed in
    Authorization.getUserDetails(req, res, userDetails => {
      const details = {
        userId: userDetails.id,
        partyId: req.body.partyId
      };
      const schema = {
        userId: Joi.number()
          .required()
          .label('Please enter user ID as a number'),
        partyId: Joi.number()
          .required()
          .label('Please enter party ID as a number')
      };

      const { error } = Joi.validate(details, schema);
      if (error)
        return res.status(400).json({ status: 400, error: error.details[0].context.label });

      // Check if the user exists
      UsersModel.fetchUserById(parseInt(details.userId, 10), ({ success, data }) => {
        if (!success) {
          // It is a server error
          return res.status(500).json({ status: 500, error: data });
        }

        // Check if the user exists
        if (data.length === 0)
          // The user does not exist
          return res.status(404).json({ status: 404, error: 'The user does not exist' });

        // Check if the party exists
        PartiesModel.fetchPartyById(parseInt(req.body.partyId, 10), partyDetails => {
          const successs = partyDetails.success;
          const dataa = partyDetails.data;
          // Check if the query was successful
          if (successs) {
            // Check if the party exists
            if (dataa.length === 0)
              return res
                .status(404)
                .json({ status: 404, error: 'The political party does not exist' });

            // Update the user party
            PartiesModel.updateUserParty(
              parseInt(details.userId, 10),
              parseInt(details.partyId, 10),
              (succ, val) => {
                if (!succ) return res.status(500).json({ status: 500, data, val });

                // Generate new token
                const token = jwt.sign({ data: val }, process.env.TOKEN_KEY, {
                  expiresIn: 60 * 60
                });
                return res.status(200).json({ status: 200, data: [{ token, user: val[0] }] });
              }
            );
          } else {
            // It is a server error
            return res.json({ status: 500, error: data });
          }
        });
        return null;
      });
      return null;
    });
  }
}

export default PartiesController;
