import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock, CheckCircle2, ShieldCheck } from 'lucide-react';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success('Password updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4">
        <Card className="w-full max-w-md shadow-xl border-muted text-center animate-in fade-in zoom-in duration-300">
          <CardHeader className="space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl font-bold">Password Reset Complete</CardTitle>
            <CardDescription className="text-base">
              Your password has been successfully updated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground text-sm">
            <p>You can now sign in using your new password.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/login')}>
              Proceed to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-muted">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
          <CardDescription>
            Enter your new account password below
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleUpdatePassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full font-medium" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Updating Password...
                </span>
              ) : (
                'Update Password'
              )}
            </Button>

            <Link to="/login" className="text-center text-sm text-muted-foreground hover:underline">
              Cancel and return to Sign In
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
