import UsersModel from '../models/users';

class UsersController {
  static fetchSpecificUser(req, res) {
    UsersModel.fetchUserById(parseInt(req.params.id, 10), ({ success, data }) => {
      // Check if the query was successful
      if (success) {
        // Check if the office exists

        if (data.length === 0)
          return res.status(404).json({ status: 404, error: 'The user does not exist' });

        // The user exists return to the user
        return res.status(200).json({ status: 200, data: [data] });
      }

      // It is a server error
      return res.json({ status: 500, error: data });
    });
  }
}

export default UsersController;
