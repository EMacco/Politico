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

    OfficeModel.registerCandidate(
      req.body.officeId,
      req.body.partyId,
      req.params.candidateId,
      ({ success, data }) => {
        if (!success) {
          // Does not meet requirement to save
          return res.status(400).json({ status: 400, error: data.detail });
        }

        return res.status(201).json({ status: 201, data });
      }
    );
    return null;
  }
}

export default OfficeController;
