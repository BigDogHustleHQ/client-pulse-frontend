'use client';

import { useSignUp } from '@clerk/nextjs';
import { AtSign, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store';

export default function RegistrationForm() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { error: createError } = await signUp.create({
      emailAddress: email,
      password,
      firstName,
      lastName: lastName.trim() || undefined,
    });

    if (createError) {
      setError(
        createError.message ?? 'Something went wrong. Please try again.',
      );
      setIsSubmitting(false);
      return;
    }

    if (signUp.status === 'complete') {
      await signUp.finalize();
      setUser({
        clerkId: signUp.createdUserId ?? '',
        email: signUp.emailAddress ?? email,
        firstName: signUp.firstName,
        lastName: signUp.lastName,
      });
      router.push('/dashboard');
    } else {
      setError('Please check your email to verify your account.');
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignUp = async () => {
    await signUp.sso({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectCallbackUrl: '/dashboard',
    });
  };

  return (
    <Card className="w-full max-w-md gap-0 p-10 shadow-xl">
      <div className="mb-8 space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Get started with ClientPulse today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-11 bg-secondary"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-11 bg-secondary"
          />
        </div>

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
          {isSubmitting ? 'Creating account…' : 'Create account'}
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
        onClick={handleGoogleSignUp}
        disabled={fetchStatus === 'fetching'}
      >
        <Image src="/icons/google.svg" alt="Google" width={18} height={18} />
        Sign up with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
