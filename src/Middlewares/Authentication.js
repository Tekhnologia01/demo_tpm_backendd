import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'tekhnologia'; 

console.log(ACCESS_TOKEN_SECRET); 

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization; 

  console.log(authHeader)

  if (!authHeader) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  const accessToken = authHeader.split(' ')[1];
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  console.log(accessToken)

  try {
    // Verify the access token
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

   
  req.user = decoded;
  console.log(req.user )

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying access token:', error.message);
    return res.status(403).json({ error: 'Invalid or expired access token' });
  }
};

export { authMiddleware };
