import Joi from 'joi';
import politicalOffices from '../models/offices';

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
}

export default OfficesController;
