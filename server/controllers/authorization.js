import jwt from 'jsonwebtoken';

class Authorization {
  static isUser(req, res, next) {
    // Get the header to see if there is a token
    const token = req.headers['x-access-token'];

    // Check if there is a token
    if (!token) {
      return res.status(401).json({ status: 401, error: 'Unauthorized Access!' });
    }

    // Check if it is a valid token
    jwt.verify(token, process.env.TOKEN_KEY, (err, _) => {
      if (err) {
        return res.status(401).json({ status: 401, error: 'Token expired please login again' });
      }

      // It is a valid token
      next();
      return null;
    });
    return null;
  }

  static parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  static isAdmin(req, res, next) {
    // Get the header to see if there is a token
    const token = req.headers['x-access-token'];

    // Check if there is a token
    if (!token) {
      return res.status(401).json({ status: 401, error: 'Unauthorized Access!' });
    }

    // Check if it is a valid token
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, error: 'Token expired please login again' });
      }

      // Check if user is admin
      if (!decoded.data.isadmin && !decoded.data.isAdmin) {
        return res.status(401).json({ status: 401, error: `Unauthorized Access!` });
      }

      next();
      return null;
    });
    return null;
  }

  static getUserDetails(req, res, completionHandler) {
    // Get the header to see if there is a token
    const token = req.headers['x-access-token'];

    // Check if there is a token
    if (!token) {
      return res.status(401).json({ status: 401, error: 'Unauthorized Access!' });
    }

    // Check if it is a valid token
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, error: 'Token expired please login again' });
      }

      completionHandler(decoded.data);
      return null;
    });
    return null;
  }
}

export default Authorization;
