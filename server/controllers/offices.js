import Joi from 'joi';
import { validateOffice } from './validationFunctions';
import Authorization from './authorization';
import OfficesModel from '../models/offices';
import PartiesModel from '../models/parties';

class OfficesController {
  // Get all offices
  static getAllOffices(req, res) {
    OfficesModel.fetchAllOffices(({ success, data }) => {
      // Check if the query was successful
      if (success) {
        return res.status(200).json({ status: 200, data });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
    return null;
  }

  // Get all offices
  static getAllCandidates(req, res) {
    OfficesModel.fetchAllCandidates(({ success, data }) => {
      // Check if the query was successful
      if (success) {
        return res.status(200).json({ status: 200, data });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
    return null;
  }

  // Get all interests
  static getAllInterests(req, res) {
    OfficesModel.fetchAllInterests(({ success, data }) => {
      // Check if the query was successful
      if (success) {
        return res.status(200).json({ status: 200, data });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
    return null;
  }

  static getSingleOffice(req, res) {
    // Check if it is a number
    const schema = {
      id: Joi.number()
        .required()
        .label('Please enter ID as a number')
    };
    const { error } = Joi.validate({ id: req.params.id }, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

    OfficesModel.fetchOfficeById(parseInt(req.params.id, 10), ({ success, data }) => {
      // Check if the query was successful
      if (success) {
        // Check if the office exists

        if (data.length === 0)
          return res
            .status(404)
            .json({ status: 404, error: 'The political office does not exist' });

        // The office exists retrun to the user
        return res.status(200).json({ status: 200, data });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
    return null;
  }

  static createPoliticalOffice(req, res) {
    // Remove white spaces
    try {
      if (req.body.name) {
        req.body.name = req.body.name
          .replace(/\s\s+/g, ' ')
          .trim()
          .toLowerCase();
      }
    } catch (error) {}

    // Validate the office details
    const { error } = validateOffice(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

    // Check if the office exists before
    OfficesModel.fetchOfficeByNameAndType(req.body.name, req.body.type, ({ success, data }) => {
      if (!success) {
        // It is a server error
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if the office exists
      if (data.length !== 0)
        // The office already exists
        return res.status(409).json({ status: 409, error: 'This political office already exists' });

      // Create the new office
      const newOffice = {
        name: req.body.name,
        type: req.body.type,
        logoUrl: req.body.logoUrl
      };

      //   Insert the new office in the array
      OfficesModel.createNewOffice(newOffice, ({ successs, dataa }) => {
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

  static deletePoliticalOffice(req, res) {
    // Check if the office exists
    OfficesModel.fetchOfficeById(parseInt(req.params.id, 10), ({ success, data }) => {
      if (!success) {
        // It is a server error
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if the office exists
      if (data.length === 0) {
        return res.status(404).json({ status: 404, error: 'Office does not exist' });
      }

      // Delete from server
      OfficesModel.deleteOfficeById(parseInt(req.params.id, 10), ({ successs }) => {
        if (!successs) {
          return res.status(500).json({ status: 500, error: data });
        }

        return res.status(200).json({ status: 200, data });
      });
      return null;
    });
    return null;
  }

  static editParticularPoliticalOffice(req, res) {
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

    OfficesModel.fetchOfficeById(parseInt(req.params.id, 10), ({ success, data }) => {
      if (!success) {
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if there is office
      if (data.length === 0) {
        return res.status(404).json({ status: 404, error: 'Office does not exist' });
      }

      // Update the office
      OfficesModel.updateOfficeNameById(
        parseInt(req.params.id, 10),
        req.body.name,
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

  static editOfficeType(req, res) {
    // Validate the name
    const schema = {
      type: Joi.string()
        .valid('federal', 'legislative', 'state', 'local')
        .min(5)
        .max(40)
        .required()
        .label('Please enter office type as: federal, legislative, state, or local'),
      id: Joi.number()
        .required()
        .label('Please enter ID as a number')
    };
    const { error } = Joi.validate({ type: req.body.type, id: req.params.id }, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

    OfficesModel.fetchOfficeById(parseInt(req.params.id, 10), ({ success, data }) => {
      if (!success) {
        return res.status(500).json({ status: 500, error: data });
      }

      // Check if there is office
      if (data.length === 0) {
        return res.status(404).json({ status: 404, error: 'Office does not exist' });
      }

      // Update the office
      OfficesModel.updateOfficeTypeById(
        parseInt(req.params.id, 10),
        req.body.type,
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

  static expressInterest(req, res) {
    // Get the id of the user that is signed in
    Authorization.getUserDetails(req, res, userDetails => {
      // Validate the data
      const details = {
        candidateId: userDetails.id,
        officeId: req.body.officeId,
        partyId: req.body.partyId
      };
      req.body.createdBy = details.createdBy;

      const schema = {
        partyId: Joi.number()
          .required()
          .label('Please enter party id as a number'),
        officeId: Joi.number()
          .required()
          .label('Please enter office id as a number'),
        candidateId: Joi.number()
          .required()
          .label('Please enter candidate id as a number')
      };

      const { error } = Joi.validate(details, schema);
      if (error) {
        return res.status(400).json({ status: 400, error: error.details[0].context.label });
      }

      OfficesModel.fetchOfficeById(parseInt(details.officeId, 10), result => {
        const officeSuccess = result.success;
        const officeData = result.data;
        // Check if the query was successful
        if (officeSuccess) {
          // Check if the office exists
          if (officeData.length === 0)
            return res
              .status(404)
              .json({ status: 404, error: 'The political office does not exist' });

          // Check if the party exists
          PartiesModel.fetchPartyById(parseInt(req.body.partyId, 10), partyDetails => {
            const partySuccess = partyDetails.success;
            const partyData = partyDetails.data;
            // Check if the query was successful
            if (partySuccess) {
              // Check if the party exists
              if (partyData.length === 0)
                return res
                  .status(404)
                  .json({ status: 404, error: 'The political party does not exist' });

              // Express the interest
              OfficesModel.expressInterest(details, ({ success, data }) => {
                if (success) {
                  // Return the new interest details to the user
                  return res.status(201).json({ status: 201, data });
                }
                return res.status(500).json({ status: 500, error: data });
              });
            } else {
              // It is a server error
              return res.json({ status: 500, error: partyData });
            }
          });
        } else {
          // It is a server error
          return res.json({ status: 500, error: officeData });
        }
      });
      return null;
    });
  }
}

export default OfficesController;
