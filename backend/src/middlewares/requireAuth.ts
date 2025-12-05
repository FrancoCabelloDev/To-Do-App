import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';
import { prisma } from '../lib/prisma.js';
import { UserRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.substring(7);

    // Validar token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Buscar o crear perfil
    let profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, role: true },
    });

    if (!profile) {
      // Auto-crear perfil con rol CLIENT
      profile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email ?? null,
          fullName: user.user_metadata?.full_name ?? null,
          avatarUrl: user.user_metadata?.avatar_url ?? null,
          role: UserRole.CLIENT,
        },
        select: { id: true, email: true, role: true },
      });
    }

    req.user = {
      id: profile.id,
      email: profile.email ?? user.email ?? '',
      role: profile.role,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
