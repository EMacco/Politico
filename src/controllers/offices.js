import Joi from 'joi';
import politicalOffices from '../models/offices';
import { validateOffice } from './validationFunctions';

class OfficesController {
  // Get all offices
  static getAllOffices(req, res) {
    return res.json({ status: 200, data: politicalOffices });
  }

  static getSingleOffice(req, res) {
    // Check if the office exists
    const foundOffice = politicalOffices.find(office => office.id === parseInt(req.params.id, 10));

    if (!foundOffice)
      return res.status(404).json({ status: 404, error: 'The political office does not exist' });

    // The office exists retrun to the user
    return res.status(200).json({ status: 200, data: [foundOffice] });
  }

  static createPoliticalOffice(req, res) {
    // Check if the data already exists
    const foundOffice = politicalOffices.find(
      office => office.name === req.body.name && office.type === req.body.type
    );
    if (foundOffice)
      return res.status(409).json({ status: 409, error: 'This political office already exists' });

    // Validate user input
    const { error } = validateOffice(req.body);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    // The data is valid create it and return
    const newOffice = {
      id: politicalOffices.length + 1,
      name: req.body.name,
      type: req.body.type,
      logoUrl: req.body.logoUrl
    };

    //   Insert the new office in the array
    politicalOffices.push(newOffice);

    return res.status(201).json({ status: 201, data: [newOffice] });
  }

  static deletePoliticalOffice(req, res) {
    // Check if the office exists
    const officeFound = politicalOffices.find(office => office.id === parseInt(req.params.id, 10));

    if (!officeFound) return res.status(404).json({ status: 404, error: 'Office does not exist' });

    // Delete the office
    const index = politicalOffices.indexOf(officeFound);
    politicalOffices.splice(index, 1);

    // Return deleted value
    return res.status(200).json({ status: 200, data: [officeFound] });
  }

  static editParticularPoliticalOffice(req, res) {
    // Check if the office exists
    const officeFound = politicalOffices.find(office => office.id === parseInt(req.params.id, 10));

    if (!officeFound) return res.status(404).json({ status: 404, error: 'Office does not exist' });

    // Validate the name
    const schema = {
      name: Joi.string()
        .min(10)
        .required()
        .trim()
        .strict()
    };
    const { error } = Joi.validate({ name: req.params.name }, schema);
    if (error) return res.status(400).json({ status: 400, error: error.details[0].message });

    // Find the index of the office in the array
    const officesIndexes = politicalOffices.map(office => office.id);
    const updateIndex = officesIndexes.indexOf(parseInt(req.params.id, 10));

    //   Update data in database
    politicalOffices[updateIndex].name = req.params.name;

    return res.status(200).json({ status: 200, data: [politicalOffices[updateIndex]] });
  }
}

export default OfficesController;
