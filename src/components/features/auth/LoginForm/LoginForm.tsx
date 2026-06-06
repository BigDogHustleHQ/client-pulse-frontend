'use client';

import { useSignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store';
import { persistSession, markTemporarySession } from '@/lib/clerk/session';

export default function LoginForm() {
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
    <div className="auth">
      <div className="auth__header">
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__subtitle">
          Please enter your details to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth__form" noValidate>
        <div className="auth__field">
          <label htmlFor="email" className="auth__label">
            Business Email
          </label>
          <div className="auth__input-wrapper">
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth__input"
              required
            />
            <span className="auth__input-icon">
              <Image src="/icons/at.svg" alt="Email" width={16} height={16} />
            </span>
          </div>
        </div>

        <div className="auth__field">
          <label htmlFor="password" className="auth__label">
            Password
          </label>
          <div className="auth__input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth__input"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
              className="auth__input-icon auth__input-icon--button"
            >
              <Image
                src={showPassword ? '/icons/eye-off.svg' : '/icons/eye.svg'}
                alt={showPassword ? 'Hide password' : 'Show password'}
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>

        <div className="auth__row">
          <label className="auth__toggle">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="auth__toggle-input"
              aria-label="Remember me"
            />
            <span className="auth__toggle-track" aria-hidden="true" />
            <span className="auth__toggle-label">Remember me</span>
          </label>
          <Link href="/login/forgot-password" className="auth__link">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p role="alert" className="auth__error">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="auth__button auth__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in to platform'}
        </button>
      </form>

      <div className="auth__divider">
        <span>Or continue with</span>
      </div>

      <button
        type="button"
        className="auth__button auth__button--social"
        onClick={handleGoogleSignIn}
        disabled={fetchStatus === 'fetching'}
      >
        <Image src="/icons/google.svg" alt="Google" width={18} height={18} />
        Sign in with Google
      </button>

      <p className="auth__footer">
        Don&apos;t have an account?{' '}
        <a href="mailto:sales@clientpulse.com" className="auth__link">
          Contact sales
        </a>
      </p>
    </div>
  );
}
