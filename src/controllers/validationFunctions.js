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
  },
  validateUser: user => {
    const schema = {
      firstName: Joi.string()
        .min(3)
        .max(15)
        .required()
        .trim()
        .strict(),
      lastName: Joi.string()
        .min(3)
        .max(15)
        .required()
        .trim()
        .strict(),
      otherName: Joi.string()
        .min(3)
        .max(15)
        .trim()
        .strict(),
      email: Joi.string()
        .min(10)
        .max(100)
        .required()
        .trim()
        .email()
        .strict(),
      password: Joi.string()
        .min(8)
        .max(15)
        .required()
        .strict(),
      phoneNumber: Joi.string()
        .regex(/^\d{11}$/)
        .required()
        .strict()
        .label('Please enter a valid phone number of 11 characters'),
      isAdmin: Joi.string()
        .min(4)
        .max(5)
        .trim()
        .valid('true', 'false')
        .strict(),
      passportUrl: Joi.string()
        .uri()
        .trim()
        .required()
    };

    return Joi.validate(user, schema);
  }
};
