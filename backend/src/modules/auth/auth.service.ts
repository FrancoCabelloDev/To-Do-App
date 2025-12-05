import { prisma } from '../../lib/prisma.js';
import { supabase } from '../../config/supabase.js';
import { UserRole } from '@prisma/client';

export class AuthService {
  async getMe(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
      },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  }

  async syncProfile(token: string) {
    // Obtener datos del usuario desde Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new Error('Invalid token');
    }

    // Upsert del perfil
    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email ?? null,
        fullName: user.user_metadata?.full_name ?? null,
        avatarUrl: user.user_metadata?.avatar_url ?? null,
        role: UserRole.CLIENT,
      },
      update: {
        email: user.email ?? undefined,
        fullName: user.user_metadata?.full_name ?? undefined,
        avatarUrl: user.user_metadata?.avatar_url ?? undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return profile;
  }
}
