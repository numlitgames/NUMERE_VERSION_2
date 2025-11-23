import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Users, 
  Clock, 
  TrendingUp, 
  Calendar,
  Shield,
  LogOut,
  Loader2,
  ArrowUpDown,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserStats {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  total_sessions: number;
  total_time_spent: number;
  last_login: string;
  created_at: string;
}

interface DailyActivity {
  date: string;
  users_count: number;
  total_time: number;
  sessions_count: number;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserStats[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [sortBy, setSortBy] = useState<'sessions' | 'time'>('sessions');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
      fetchDailyActivity();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order(sortBy === 'sessions' ? 'total_sessions' : 'total_time_spent', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchDailyActivity = async () => {
    try {
      // Get last 7 days of activity
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      if (error) throw error;
      setDailyActivity(data || []);
    } catch (error) {
      console.error('Error fetching daily activity:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleUserAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Error toggling admin status:', error);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const totalUsers = users.length;
  const totalSessions = users.reduce((sum, u) => sum + (u.total_sessions || 0), 0);
  const totalTime = users.reduce((sum, u) => sum + (u.total_time_spent || 0), 0);
  const avgTimePerUser = totalUsers > 0 ? totalTime / totalUsers : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback>{user.user_metadata.full_name?.[0] || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">Dashboard Admin</CardTitle>
                <CardDescription>
                  Bine ai venit, {user.user_metadata.full_name}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="mr-2 h-4 w-4" />
                Acasă
              </Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Deconectare
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Utilizatori înregistrați
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiuni Totale</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Accesări platformă
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timp Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(totalTime)}</div>
              <p className="text-xs text-muted-foreground">
                Petrecut pe platformă
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medie / Utilizator</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(avgTimePerUser)}</div>
              <p className="text-xs text-muted-foreground">
                Timp mediu/utilizator
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="users">Utilizatori</TabsTrigger>
            <TabsTrigger value="activity">Activitate Zilnică</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Utilizatori Platformă</CardTitle>
                    <CardDescription>
                      Sortați după {sortBy === 'sessions' ? 'număr de accesări' : 'timp petrecut'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSortBy(sortBy === 'sessions' ? 'time' : 'sessions');
                      fetchUsers();
                    }}
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {sortBy === 'sessions' ? 'Sortează după timp' : 'Sortează după accesări'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilizator</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Accesări</TableHead>
                      <TableHead className="text-center">Timp Petrecut</TableHead>
                      <TableHead className="text-center">Ultima Vizită</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={u.avatar_url || undefined} />
                              <AvatarFallback>{u.full_name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{u.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell className="text-center font-semibold">
                          {u.total_sessions || 0}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatTime(u.total_time_spent || 0)}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatDate(u.last_login)}
                        </TableCell>
                        <TableCell className="text-center">
                          {u.is_admin ? (
                            <Badge variant="default" className="gap-1">
                              <Shield className="h-3 w-3" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="secondary">User</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {u.id !== user.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserAdmin(u.id, u.is_admin)}
                            >
                              {u.is_admin ? 'Revocă Admin' : 'Fă Admin'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Activitate Ultimele 7 Zile</CardTitle>
                <CardDescription>
                  Statistici zilnice despre utilizatori și timpul petrecut
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-center">Utilizatori Activi</TableHead>
                      <TableHead className="text-center">Sesiuni</TableHead>
                      <TableHead className="text-center">Timp Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyActivity.map((day) => (
                      <TableRow key={day.date}>
                        <TableCell className="font-medium">
                          {new Date(day.date).toLocaleDateString('ro-RO', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-center">{day.users_count}</TableCell>
                        <TableCell className="text-center">{day.sessions_count}</TableCell>
                        <TableCell className="text-center">{formatTime(day.total_time)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

