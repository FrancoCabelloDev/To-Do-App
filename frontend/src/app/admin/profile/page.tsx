'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { Topbar } from '@/components/layout/Topbar';
import { Shield, Mail, Calendar, UserCircle } from 'lucide-react';

export default function AdminProfilePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
    .toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'A';

  return (
    <AdminRoute>
      <div className="flex h-screen flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto bg-linear-to-br from-background to-muted/20">
          <div className="container max-w-4xl mx-auto py-4 px-4">
            {/* Header */}
            <div className="mb-4 text-center">
              <div className="inline-flex items-center justify-center p-1.5 bg-primary/10 rounded-full mb-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-0.5">Admin Profile</h1>
              <p className="text-sm text-muted-foreground">Administrator account information</p>
            </div>

            {/* Profile Card */}
            <Card className="mb-3 shadow-lg border-2">
              <CardHeader className="text-center py-3 pb-2">
                <div className="flex justify-center mb-2">
                  <Avatar className="h-16 w-16 border-3 border-primary shadow-lg">
                    <AvatarImage src={profile?.avatarUrl || undefined} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="text-xl font-bold mb-0.5">
                  {profile?.fullName || 'Administrator'}
                </h3>
                <p className="text-sm text-muted-foreground mb-1.5">{profile?.email}</p>
                <div className="flex justify-center">
                  <Badge variant="default" className="gap-1 px-2 py-0.5 text-xs">
                    <Shield className="h-3 w-3" />
                    Administrator
                  </Badge>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="py-3">
                <div className="grid gap-2 grid-cols-2">
                  <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      Email
                    </div>
                    <p className="text-xs font-semibold truncate">{profile?.email}</p>
                  </div>

                  <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Member Since
                    </div>
                    <p className="text-xs font-semibold">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })
                        : 'Unknown'}
                    </p>
                  </div>

                  <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Shield className="h-3 w-3" />
                      Type
                    </div>
                    <p className="text-xs font-semibold">Administrator</p>
                  </div>

                  <div className="space-y-1 p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <UserCircle className="h-3 w-3" />
                      Name
                    </div>
                    <p className="text-xs font-semibold truncate">{profile?.fullName || 'Administrator'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Privileges Card */}
            <Card className="shadow-lg border-2">
              <CardHeader className="text-center py-2">
                <CardTitle className="flex items-center justify-center gap-1.5 text-base">
                  <Shield className="h-4 w-4 text-primary" />
                  Privileges
                </CardTitle>
              </CardHeader>
              <CardContent className="py-3">
                <div className="grid gap-1.5 grid-cols-2">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-xs font-medium">Admin dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-xs font-medium">Manage users</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-xs font-medium">Manage projects</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-xs font-medium">Manage tasks</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 col-span-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    <span className="text-xs font-medium">Access to system statistics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
