import Joi from 'joi';
import politicalOffices from '../models/offices';

class OfficesController {
  // Get all offices
  static getAllOffices(req, res) {
    return res.json({ status: 200, data: politicalOffices });
  }
}

export default OfficesController;
