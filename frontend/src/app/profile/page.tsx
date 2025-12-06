'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AppShell } from '@/components/layout/AppShell';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // Redirigir admins a su perfil específico
    if (!loading && profile?.role === 'ADMIN') {
      router.push('/admin/profile');
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = profile?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U';

  return (
    <AppShell
      selectedProjectId={selectedProjectId}
      onSelectProject={setSelectedProjectId}
      onNewProject={() => {}}
    >
      <div className="container max-w-4xl p-6">
        <h2 className="mb-6 text-3xl font-bold">Profile</h2>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatarUrl || undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold">
                  {profile?.fullName || 'No name set'}
                </h3>
                <p className="text-muted-foreground">{profile?.email}</p>
                {profile?.role === 'ADMIN' && (
                  <Badge variant="default" className="mt-2">
                    Administrator
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <p className="mt-1.5 text-sm">{profile?.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Member Since
                </label>
                <p className="mt-1.5 text-sm">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Unknown'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Account Type
                </label>
                <p className="mt-1.5 text-sm">
                  {profile?.role === 'ADMIN' ? 'Administrator' : 'Standard User'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p className="mt-1.5 text-sm">{profile?.fullName || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
