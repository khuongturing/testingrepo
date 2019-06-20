import jwt from 'jsonwebtoken';
import { TOKEN_EXPIRTY_TIME, JWT_SECRET } from 'src/config/constants';

export const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.customer_id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRTY_TIME }
  );

  return {
    token: `Bearer ${token}`,
    expiresIn: TOKEN_EXPIRTY_TIME
  };
};
