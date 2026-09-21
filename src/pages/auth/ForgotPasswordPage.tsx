import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);

      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSubmitted(true);
        toast.success('Password reset link sent to your email.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send password reset request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4">
        <Card className="w-full max-w-md shadow-xl border-muted text-center animate-in fade-in zoom-in duration-300">
          <CardHeader className="space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              Password reset link sent to <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground text-sm">
            <p>
              If an account exists with that email, you will receive instructions on how to reset your password shortly.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn't receive an email? Check your spam folder or try requesting a new link.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSubmitted(false)}
            >
              Try another email address
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="ghost" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Button>
            </Link>
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
            <KeyRound className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your registered email address to receive password reset instructions
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Sending Link...
                </span>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>

            <Link to="/login" className="text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
