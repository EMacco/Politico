import Joi from 'joi';
import OfficeModel from '../models/office';
import UsersModel from '../models/users';

class OfficeController {
  static registerCandidate(req, res) {
    // Validate the data
    const details = {
      officeId: req.body.officeId,
      partyId: req.body.partyId,
      candidateId: req.params.candidateId
    };

    const schema = {
      officeId: Joi.number()
        .required()
        .label('Please enter office ID as a number'),
      partyId: Joi.number()
        .required()
        .label('Please enter party ID as a number'),
      candidateId: Joi.number()
        .required()
        .label('Please enter candidate number as a number')
    };

    const { error } = Joi.validate(details, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

    // Check if this office already has a candidate from my party
    OfficeModel.checkIfPartySlotAvailable(
      details.officeId,
      details.partyId,
      ({ err, partyInfo }) => {
        if (err) return res.status(500).json({ status: 500, error: partyInfo });
        if (partyInfo.length !== 0)
          return res
            .status(409)
            .json({ status: 409, error: 'Your party already has a candidate for this office' });

        // Your party does not have a candidate yet
        OfficeModel.registerCandidate(
          req.body.officeId,
          req.body.partyId,
          req.params.candidateId,
          ({ success, data }) => {
            if (!success) {
              // Does not meet requirement to save
              return res.status(400).json({ status: 400, error: data.detail });
            }
            // Successfully registered new candidate remove the person from expressed interest
            OfficeModel.removeInterest(
              parseInt(req.body.officeId, 10),
              parseInt(req.body.partyId, 10),
              parseInt(req.params.candidateId, 10),
              () => {
                return res.status(201).json({
                  status: 201,
                  data: { office: data[0].officeid, user: data[0].candidateid }
                });
              }
            );
          }
        );
      }
    );
    return null;
  }

  static collateResult(req, res) {
    const details = {
      officeId: req.params.officeId
    };
    const schema = {
      officeId: Joi.number()
        .required()
        .label('Please enter office ID as a number')
    };

    const { error } = Joi.validate(details, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });
    // Check if the office exists
    OfficeModel.fetchOfficeById(parseInt(req.params.officeId, 10), ({ success, data }) => {
      // Check if the query was successful
      if (!success) {
        // It is a server error
        return res.json({ status: 500, error: data });
      }

      // Check if the office exists
      if (data.length === 0)
        return res.status(404).json({ status: 404, error: 'The political office does not exist' });

      // The office exists collate the result
      OfficeModel.collateResult(parseInt(req.params.officeId, 10), ({ successs, dataa }) => {
        if (!successs) {
          return res.status(500).json({ status: 500, error: dataa });
        }

        return res.status(200).json({
          status: 200,
          data: dataa
        });
      });
    });
    return null;
  }

  static fetchVotesForOffice(req, res) {
    const details = {
      officeId: req.params.officeId
    };
    const schema = {
      officeId: Joi.number()
        .required()
        .label('Please enter office ID as a number')
    };

    const { error } = Joi.validate(details, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

    OfficeModel.fetchOfficeById(parseInt(details.officeId, 10), ({ success, data }) => {
      // Check if the query was successful
      if (success) {
        // Check if the office exists

        if (data.length === 0)
          return res
            .status(404)
            .json({ status: 404, error: 'The political office does not exist' });

        // The office exists retrun to the user get the votes
        OfficeModel.fetchVotesByOfficeId(parseInt(details.officeId, 10), ({ successs, dataa }) => {
          // Check if the query was successful
          if (successs) {
            return res.status(200).json({ status: 200, dataa });
          }
        });
      } else {
        // It is a server error
        return res.json({ status: 500, error: data });
      }
    });
    return null;
  }

  static fetchVotesForUser(req, res) {
    const details = {
      userId: req.params.userId
    };
    const schema = {
      userId: Joi.number()
        .required()
        .label('Please enter user ID as a number')
    };

    const { error } = Joi.validate(details, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

    UsersModel.fetchUserById(parseInt(details.userId, 10), ({ success, data }) => {
      // Check if the query was successful
      if (success) {
        // Check if the office exists

        if (data.length === 0)
          return res.status(404).json({ status: 404, error: 'The user does not exist' });

        // The user exists return the votes
        OfficeModel.fetchVotesByVoterId(parseInt(details.userId, 10), ({ successs, dataa }) => {
          // Check if the query was successful
          if (successs) {
            return res.status(200).json({ status: 200, dataa });
          }
        });
      } else {
        // It is a server error
        return res.json({ status: 500, error: data });
      }
    });
    return null;
  }

  static scheduleElection(req, res) {
    const details = {
      officeId: req.body.officeId,
      date: req.body.date
    };
    const schema = {
      officeId: Joi.number()
        .required()
        .label('Please enter office ID as a number'),
      date: Joi.required().label('Please enter a valid date')
    };

    const { error } = Joi.validate(details, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].context.label });

    // Check if the office has at least two candidates
    OfficeModel.fetchOfficeById(parseInt(details.officeId, 10), ({ success, data }) => {
      if (!success)
        return res.status(500).json({
          status: 500,
          error: data
        });

      if (data.length === 0)
        return res.status(404).json({
          status: 404,
          error: 'Office does not exist'
        });

      // Check if the office has a candidate
      OfficeModel.fetchCandidatesByOfficeId(parseInt(details.officeId, 10), candRes => {
        if (!candRes.success)
          return res.status(500).json({
            status: 500,
            error: candRes.data
          });

        if (candRes.data.length < 2)
          return res.status(400).json({
            status: 400,
            error: 'Office must have at least two candidates to conduct an election'
          });

        // Set the date of the election
        OfficeModel.setElectionDate(parseInt(details.officeId, 10), details.date, updateRes => {
          if (updateRes.success) return res.status(200).json({ status: 200, data: updateRes.data });
          return res.status(500).json({ status: 400, error: updateRes.data });
        });
      });
      return null;
    });
    return null;
  }

  static declineInterest(req, res) {
    // Validate the data
    const details = {
      candidateId: req.params.userId,
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

    // Delete the interest
    OfficeModel.deleteRequest(details.candidateId, details.officeId, details.partyId, delRes => {
      return res.status(200).json({ status: 200, data: delRes.data });
    });
  }
}

export default OfficeController;
