import Joi from 'joi';

module.exports = {
  validateOffice: office => {
    // TODO make it validate a url
    const schema = {
      name: Joi.string()
        .min(10)
        .max(40)
        .required()
        .trim()
        .strict(),
      type: Joi.string()
        .valid('federal', 'legislative', 'state', 'local')
        .max(40)
        .required(),
      logoUrl: Joi.string()
        .uri()
        .trim()
        .required()
    };
    return Joi.validate(office, schema);
  },
  validateParty: party => {
    const schema = {
      name: Joi.string()
        .min(10)
        .max(40)
        .required()
        .trim()
        .strict(),
      hqAddress: Joi.string()
        .min(10)
        .max(100)
        .required()
        .trim()
        .strict(),
      logoUrl: Joi.string()
        .uri()
        .trim()
        .required()
    };

    return Joi.validate(party, schema);
  }
};
