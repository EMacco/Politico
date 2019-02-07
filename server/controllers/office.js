import Joi from 'joi';
import OfficeModel from '../models/office';

class OfficeController {
  static registerCandidate(req, res) {
    // Validate the data
    const details = {
      officeId: req.body.officeId,
      partyId: req.body.partyId,
      candidateId: req.params.candidateId
    };

    const schema = {
      officeId: Joi.number().required(),
      partyId: Joi.number().required(),
      candidateId: Joi.number().required()
    };

    const { error } = Joi.validate(details, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

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
            return res
              .status(201)
              .json({ status: 201, data: { office: data[0].officeid, user: data[0].candidateid } });
          }
        );
      }
    );
    return null;
  }

  static collateResult(req, res) {
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
}

export default OfficeController;
