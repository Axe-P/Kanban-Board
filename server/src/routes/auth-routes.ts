import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      console.error('JWT_SECRET_KEY is not defined in environment variables');
      return res.status(500).json({ message: 'Server error' });
    }

    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    console.log('Generated Token:', token);
    
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Error in login route:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;