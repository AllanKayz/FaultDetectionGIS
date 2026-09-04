import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { mockDb, isPostgresAvailable, pool } from '../db';
import { generateToken, authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { LoginSchema, RegisterUserSchema } from '../schemas';

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, errors: result.error.errors });
    return;
  }

  const { email, password } = result.data;

  try {
    let user;

    if (isPostgresAvailable) {
      const dbRes = await pool.query('SELECT * FROM employees WHERE email = $1', [email]);
      if (dbRes.rows.length > 0) {
        user = dbRes.rows[0];
      }
    } else {
      user = mockDb.employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    let isMatch = false;
    if (user.password && user.password.startsWith('$2a$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const tokenUser = {
      empid: user.empid,
      email: user.email,
      rank: user.rank,
      firstname: user.firstname,
      surname: user.surname
    };

    const token = generateToken(tokenUser);

    res.json({
      success: true,
      token,
      user: tokenUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  const result = RegisterUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ success: false, errors: result.error.errors });
    return;
  }

  const data = result.data;

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    if (isPostgresAvailable) {
      const insertQuery = `
        INSERT INTO employees (firstname, surname, email, password, rank, address, phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING empid, firstname, surname, email, rank
      `;
      const values = [data.firstname, data.surname, data.email, hashedPassword, data.rank, data.address || '', data.phone || ''];
      const dbRes = await pool.query(insertQuery, values);
      res.status(201).json({ success: true, user: dbRes.rows[0] });
    } else {
      const newEmpid = mockDb.employees.length + 1;
      const newUser = {
        empid: newEmpid,
        firstname: data.firstname,
        surname: data.surname,
        email: data.email,
        password: hashedPassword,
        rank: data.rank,
        address: data.address,
        phone: data.phone
      };
      mockDb.employees.push(newUser);
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json({ success: true, user: userWithoutPassword });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

authRouter.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});
