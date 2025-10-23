const VALID_API_KEY = 'test-api-key-12345';

export const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'API key not provided' 
    });
  }
  
  if (apiKey !== VALID_API_KEY) {  
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'Invalid API key.' 
    });
  }
  
  next();
};

export { VALID_API_KEY };