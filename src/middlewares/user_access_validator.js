import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Expect header: "Bearer <dbId>|<jwtToken>"
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Split to get the actual JWT
    const tokenParts = accessToken.split('|');
    if (tokenParts.length !== 2) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const jwtToken = tokenParts[1];

    // Verify JWT
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};
