import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, Phone, User, CheckCircle2 } from 'lucide-react';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signedUpSuccess, setSignedUpSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

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

      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
          },
        },
      });

      if (error) {
        if (error.status === 429 || error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('security')) {
          toast.error('Email rate limit reached: Supabase limits signup emails per hour on the default mail server. Please wait a few minutes before trying again.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        // Ensure profile row exists in 'profiles' table
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          phone: phone || null,
          role: 'citizen',
        });

        if (profileError) {
          console.warn('Profile creation sync note:', profileError.message);
        }

        // If email confirmation is required or session exists
        if (data.session) {
          toast.success('Account created successfully! Welcome aboard.');
          navigate('/dashboard');
        } else {
          setSignedUpSuccess(true);
          toast.success('Registration successful! Please check your email to confirm your account.');
        }
      }
    } catch (err: any) {
      if (err.status === 429 || err?.message?.toLowerCase().includes('rate limit')) {
        toast.error('Too many requests. Please wait a few minutes before creating another account.');
      } else {
        toast.error(err.message || 'An unexpected error occurred during sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  if (signedUpSuccess) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4">
        <Card className="w-full max-w-md shadow-xl border-muted text-center animate-in fade-in zoom-in duration-300">
          <CardHeader className="space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground text-sm">
            <p>
              Please click the link in your email to verify your account and start reporting and tracking road issues in Niger State & FCT.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Link to="/login" className="w-full">
              <Button variant="default" className="w-full">
                Proceed to Sign In
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full text-xs"
              onClick={() => setSignedUpSuccess(false)}
            >
              Back to Form
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-muted backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
          <CardDescription>
            Join RoadWatch to report infrastructure issues and track responses
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Ibrahim Abubakar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2 text-left">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="password">Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
