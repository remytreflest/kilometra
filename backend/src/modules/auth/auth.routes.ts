import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

const registerSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (min 6 caractères)'),
});

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/me', authMiddleware, AuthController.me);

export default router;
