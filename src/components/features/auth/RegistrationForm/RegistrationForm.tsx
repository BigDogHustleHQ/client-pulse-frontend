'use client';

import { useSignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
      setError(createError.message ?? 'Something went wrong. Please try again.');
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
    <div className="auth">
      <div className="auth__header">
        <h1 className="auth__title">Create your account</h1>
        <p className="auth__subtitle">Get started with ClientPulse today.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth__form" noValidate>
        <div className="auth__field">
          <label htmlFor="firstName" className="auth__label">First Name</label>
          <input
            id="firstName"
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="auth__input"
            required
          />
        </div>

        <div className="auth__field">
          <label htmlFor="lastName" className="auth__label">Last Name</label>
          <input
            id="lastName"
            type="text"
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="auth__input"
          />
        </div>

        <div className="auth__field">
          <label htmlFor="email" className="auth__label">Business Email</label>
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
          <label htmlFor="password" className="auth__label">Password</label>
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

        {error && (
          <p role="alert" className="auth__error">{error}</p>
        )}

        <button type="submit" className="auth__button auth__button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="auth__divider">
        <span>Or continue with</span>
      </div>

      <button
        type="button"
        className="auth__button auth__button--social"
        onClick={handleGoogleSignUp}
        disabled={fetchStatus === 'fetching'}
      >
        <Image src="/icons/google.svg" alt="Google" width={18} height={18} />
        Sign up with Google
      </button>

      <p className="auth__footer">
        Already have an account?{' '}
        <Link href="/login" className="auth__link">Log in</Link>
      </p>
    </div>
  );
}
