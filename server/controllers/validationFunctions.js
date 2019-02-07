import Joi from 'joi';

module.exports = {
  validateOffice: office => {
    const schema = {
      name: Joi.string()
        .min(10)
        .max(40)
        .required(),
      type: Joi.string()
        .valid('federal', 'legislative', 'state', 'local')
        .max(40)
        .required(),
      logoUrl: Joi.string()
        .uri()
        .required()
    };
    return Joi.validate(office, schema);
  },
  validateParty: party => {
    const schema = {
      name: Joi.string()
        .min(10)
        .max(40)
        .required(),
      hqAddress: Joi.string()
        .min(10)
        .max(100)
        .required(),
      logoUrl: Joi.string()
        .uri()
        .required()
    };

    return Joi.validate(party, schema);
  },
  validateUser: user => {
    const schema = {
      firstName: Joi.string()
        .min(3)
        .max(15)
        .required(),
      lastName: Joi.string()
        .min(3)
        .max(15)
        .required(),
      otherName: Joi.string()
        .min(3)
        .max(15),
      email: Joi.string()
        .min(10)
        .max(100)
        .required()
        .email({ minDomainAtoms: 2 }),
      password: Joi.string()
        .min(8)
        .max(15)
        .required(),
      phoneNumber: Joi.string()
        .regex(/^\d{11}$/)
        .required()
        .label('Please enter a valid phone number of 11 characters'),
      passportUrl: Joi.string()
        .uri()
        .required(),
      isAdmin: Joi.string().valid('true', 'false')
    };

    return Joi.validate(user, schema);
  },
  validateUserLogin: user => {
    const schema = {
      email: Joi.string()
        .min(10)
        .max(100)
        .required()
        .email({ minDomainAtoms: 2 }),
      password: Joi.string()
        .min(8)
        .max(15)
        .required()
    };

    return Joi.validate(user, schema);
  }
};
