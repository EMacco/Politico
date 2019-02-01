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
}

export default OfficesController;
