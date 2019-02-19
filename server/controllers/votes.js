import Joi from 'joi';
import VotesModel from '../models/votes';
import Authorization from './authorization';

class VotesController {
  static registerVote(req, res) {
    // Get the id of the user that is signed in //#endregion
    Authorization.getUserDetails(req, res, userDetails => {
      // Validate the data
      const details = {
        createdBy: userDetails.id,
        officeId: req.body.officeId,
        candidateId: req.body.candidateId
      };
      req.body.createdBy = details.createdBy;

      const schema = {
        createdBy: Joi.number()
          .required()
          .label('Please enter office user id'),
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

      // Check if this user has voted for the candidate
      VotesModel.checkIfVotedBefore(details.createdBy, details.officeId, (err, voted) => {
        if (err)
          return res
            .status(400)
            .json({ status: 400, error: 'You have provided an invalid information' });
        if (voted) {
          // You have voted
          return res.status(400).json({ status: 400, error: 'You have already casted your vote' });
        }

        // You have not yet voted, Check if the candidate and office is in candidate table
        VotesModel.checkIfActiveElection(details.candidateId, details.officeId, (err2, valid) => {
          if (err2)
            return res
              .status(400)
              .json({ status: 400, error: 'You have provided an invalid information' });
          if (!valid) {
            return res
              .status(400)
              .json({ status: 400, error: 'Person/Office is not registered for election' });
          }

          // Go ahead and register the vote
          VotesModel.registerVote(
            req.body.createdBy,
            req.body.officeId,
            req.body.candidateId,
            ({ success, data }) => {
              if (!success) {
                // Does not meet requirement to save
                return res.status(400).json({ status: 400, error: data.detail });
              }

              return res.status(201).json({
                status: 201,
                data: {
                  office: data[0].officeid,
                  candidate: data[0].candidateid,
                  voter: data[0].createdby
                }
              });
            }
          );
        });
      });

      return null;
    });
  }
}

export default VotesController;
