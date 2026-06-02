'use client';

import { useSignIn } from '@clerk/nextjs';
import { AtSign, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';
import { persistSession, markTemporarySession } from '@/lib/clerk/session';

const LoginForm = () => {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { error: createError } = await signIn.create({
      identifier: email,
      password,
    });

    if (createError) {
      setError(
        createError.message ?? 'Something went wrong. Please try again.',
      );
      setIsSubmitting(false);
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize();

      if (rememberMe) {
        persistSession();
      } else {
        markTemporarySession();
      }

      setUser({
        clerkId: signIn.createdSessionId ?? '',
        email: signIn.identifier ?? email,
        firstName: signIn.userData.firstName ?? null,
        lastName: signIn.userData.lastName ?? null,
      });
      setIsSubmitting(false);

      router.push('/dashboard');
      return;
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    await signIn.sso({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectCallbackUrl: '/dashboard',
    });
  };

  return (
    <Card className="w-full max-w-md gap-0 p-10 shadow-xl">
      <div className="mb-8 space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your details to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Business Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-secondary pr-10"
              required
            />
            <AtSign className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-secondary pr-10"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              aria-label="Remember me"
            />
            <Label htmlFor="rememberMe" className="cursor-pointer font-normal">
              Remember me
            </Label>
          </div>
          <Link
            href="/login/forgot-password"
            className="text-sm font-medium text-brand hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="mt-1 h-11 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in to platform'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs whitespace-nowrap text-muted-foreground">
          Or continue with
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="secondary"
        className="h-11 w-full gap-2.5"
        onClick={handleGoogleSignIn}
        disabled={fetchStatus === 'fetching'}
      >
        <Image src="/icons/google.svg" alt="Google" width={18} height={18} />
        Sign in with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a
          href="mailto:sales@clientpulse.com"
          className="font-medium text-brand hover:underline"
        >
          Contact sales
        </a>
      </p>
    </Card>
  );
};

export default LoginForm;
