import Joi from 'joi';

module.exports = {
  validateOffice: office => {
    const schema = {
      name: Joi.string()
        .min(5)
        .max(40)
        .required()
        .label('Please enter name that contains 5 - 40 characters'),
      type: Joi.string()
        .valid('federal', 'legislative', 'state', 'local')
        .max(40)
        .required()
        .label('Please enter valid office type (federal, legislative, state, local)'),
      logoUrl: Joi.string()
        .uri()
        .label('Please enter a valid image url')
    };
    return Joi.validate(office, schema);
  },
  validateParty: party => {
    const schema = {
      name: Joi.string()
        .min(5)
        .max(40)
        .required()
        .label('Please enter name that contains 5 - 40 characters'),
      hqAddress: Joi.string()
        .min(10)
        .max(100)
        .required()
        .label('Please enter HQ address that contains 10 - 100 characters'),
      logoUrl: Joi.string()
        .uri()
        .label('Please enter a valid logo url')
    };

    return Joi.validate(party, schema);
  },
  validateUser: user => {
    const schema = {
      firstName: Joi.string()
        .min(3)
        .max(15)
        .required()
        .label('Please enter valid First name that contains 3 - 15 characters'),
      lastName: Joi.string()
        .min(3)
        .max(15)
        .required()
        .label('Please enter valid Last name that contains 3 - 15 characters'),
      otherName: Joi.string()
        .min(3)
        .max(15)
        .label('Please enter valid Other name that contains 3 - 15 characters'),
      email: Joi.string()
        .max(100)
        .required()
        .email({ minDomainAtoms: 2 })
        .label('Please enter a valid email address'),
      password: Joi.string()
        .min(8)
        .max(15)
        .required()
        .label('Please enter password that contains 8 - 15 characters'),
      phoneNumber: Joi.string()
        .regex(/^\d{11}$/)
        .required()
        .label('Please enter a valid phone number of 11 characters'),
      passportUrl: Joi.string()
        .uri()
        .label('Please enter a valid URL'),
      isAdmin: Joi.string()
        .valid('true', 'false')
        .label('Admin can only be true or false')
    };

    return Joi.validate(user, schema);
  },
  validateUserLogin: user => {
    const schema = {
      email: Joi.string()
        .max(100)
        .required()
        .email({ minDomainAtoms: 2 })
        .label('Please enter a valid email address'),
      password: Joi.string()
        .min(8)
        .max(15)
        .required()
        .label('Please enter password that contains 8 - 15 characters')
    };

    return Joi.validate(user, schema);
  }
};
