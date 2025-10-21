import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 

      if (!req.user) {
         return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminProtect = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next(); 
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' }); 
    }
};

export { protect, adminProtect };