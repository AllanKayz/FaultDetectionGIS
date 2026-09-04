import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Valid email is required' }),
  password: z.string().min(1, { message: 'Password is required' })
});

export const RegisterUserSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  rank: z.enum(['Foreman', 'Artisan', 'Artisan Assistant', 'Admin']),
  address: z.string().optional(),
  phone: z.string().optional()
});

export const CreateFaultSchema = z.object({
  type: z.string().min(1, 'Fault type is required'),
  fname: z.string().min(1, 'Fault name/location is required'),
  severity: z.enum(['Critical', 'Major', 'Minor', 'Low']),
  priority_level: z.enum(['High', 'Medium', 'Low']).default('Medium'),
  description: z.string().optional(),
  artisan: z.string().optional(),
  coordinates: z.tuple([z.number(), z.number()]).or(z.string())
});

export const UpdateFaultStatusSchema = z.object({
  rectification: z.enum(['Pending', 'In progress', 'Completed']),
  artisan: z.string().optional(),
  description: z.string().optional()
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type CreateFaultInput = z.infer<typeof CreateFaultSchema>;
export type UpdateFaultStatusInput = z.infer<typeof UpdateFaultStatusSchema>;
