import Joi from 'joi';

module.exports = {
  validateOffice: office => {
    // TODO make it validate a url
    const schema = {
      name: Joi.string()
        .min(10)
        .required(),
      type: Joi.string()
        .valid('federal', 'legislative', 'state', 'local')
        .required(),
      logoUrl: Joi.string().required()
    };
    return Joi.validate(office, schema);
  },
  validateParty: party => {
    // TODO make it validate a url
    const schema = {
      name: Joi.string()
        .min(10)
        .required(),
      hqAddress: Joi.string()
        .min(10)
        .required(),
      logoUrl: Joi.string().required()
    };

    return Joi.validate(party, schema);
  }
};
