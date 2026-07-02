import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../core/database';
import { config } from '../../core/config';

export class AuthService {
  public static async authenticateUser(username: string, password_text: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.is_active) {
      throw new Error('Invalid credentials or inactive account configuration.');
    }

    const passwordMatches = await bcrypt.compare(password_text, user.password_hash);
    if (!passwordMatches) {
      throw new Error('Invalid credentials or inactive account configuration.');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwtSecret,
      { expiresIn: '12h' }
    );

    return {
      token,
      profile: { id: user.id, username: user.username, role: user.role }
    };
  }
}