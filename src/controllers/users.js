import Joi from 'joi';
import users from '../models/users';

class UsersController {
  static fetchSpecificUser(req, res) {
    const foundUser = users.find(user => user.email === req.params.email);

    if (!foundUser) return res.status(404).json({ status: 404, error: 'User does not exist' });

    // The user exists return the user's details
    return res.status(200).json({ status: 200, data: [foundUser] });
  }
}

export default UsersController;
