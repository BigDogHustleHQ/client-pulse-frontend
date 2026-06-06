'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type Step = 'email' | 'code' | 'password';

export const STEPS: Step[] = ['email', 'code', 'password'];

interface ForgotPasswordFormProps {
  onStepChange?: (stepIndex: number) => void;
}

export default function ForgotPasswordForm({
  onStepChange,
}: ForgotPasswordFormProps) {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<Step>('email');
  const [isComplete, setIsComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    onStepChange?.(STEPS.indexOf(step));
  }, [step, onStepChange]);

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { error: createError } = await signIn.create({ identifier: email });

    if (createError) {
      setError(
        createError.message ?? 'Something went wrong. Please try again.',
      );
      setIsSubmitting(false);
      return;
    }

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();

    if (sendError) {
      setError(sendError.message ?? 'Something went wrong. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setStep('code');
    setIsSubmitting(false);
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { error: verifyError } =
      await signIn.resetPasswordEmailCode.verifyCode({ code });

    if (verifyError) {
      setError(
        verifyError.message ?? 'Something went wrong. Please try again.',
      );
      setIsSubmitting(false);
      return;
    }

    setStep('password');
    setIsSubmitting(false);
  };

  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const { error: submitError } =
      await signIn.resetPasswordEmailCode.submitPassword({ password });

    if (submitError) {
      setError(
        submitError.message ?? 'Something went wrong. Please try again.',
      );
      setIsSubmitting(false);
      return;
    }

    setIsComplete(true);
    setIsSubmitting(false);
  };

  if (isComplete) {
    return (
      <div className="auth auth--centered">
        <div
          className="auth__icon-badge auth__icon-badge--success"
          aria-hidden="true"
        >
          ✓
        </div>
        <div className="auth__header">
          <h1 className="auth__title">Password Updated!</h1>
          <p className="auth__subtitle">
            Your password has been reset. You can now sign in with your new
            credentials.
          </p>
        </div>
        <button
          type="button"
          className="auth__button auth__button--primary"
          onClick={() => router.push('/login')}
        >
          Sign in now →
        </button>
      </div>
    );
  }

  const headings: Record<Step, { title: string; subtitle: string }> = {
    email: {
      title: 'Reset Password',
      subtitle:
        "Enter the email address associated with your account and we'll send you a link to reset your password.",
    },
    code: {
      title: 'Check Your Email',
      subtitle: `We sent a 6-digit code to ${email}. Enter it below to continue.`,
    },
    password: {
      title: 'New Password',
      subtitle: 'Choose a strong password for your account.',
    },
  };

  const { title, subtitle } = headings[step];

  return (
    <div className="auth auth--centered">
      <div className="auth__icon-badge">
        <Image
          src="/icons/reset.svg"
          alt=""
          width={24}
          height={24}
          aria-hidden="true"
        />
      </div>

      <div className="auth__header">
        <h1 className="auth__title">{title}</h1>
        <p className="auth__subtitle">{subtitle}</p>
      </div>

      {step === 'email' && (
        <form onSubmit={handleSendCode} className="auth__form" noValidate>
          <div className="auth__field">
            <label htmlFor="fp-email" className="auth__label">
              Email Address
            </label>
            <input
              id="fp-email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth__input auth__input--no-icon"
              required
            />
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
            {isSubmitting ? (
              'Sending…'
            ) : (
              <>
                <span>Send Reset Link</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleVerifyCode} className="auth__form" noValidate>
          <div className="auth__field">
            <label htmlFor="fp-code" className="auth__label">
              Verification Code
            </label>
            <input
              id="fp-code"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="auth__input auth__input--code"
              maxLength={6}
              required
            />
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
            {isSubmitting ? (
              'Verifying…'
            ) : (
              <>
                <span>Verify Code</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handleSubmitPassword} className="auth__form" noValidate>
          <div className="auth__field">
            <label htmlFor="fp-password" className="auth__label">
              New Password
            </label>
            <div className="auth__input-wrapper">
              <input
                id="fp-password"
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
                  alt=""
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>

          <div className="auth__field">
            <label htmlFor="fp-confirm" className="auth__label">
              Confirm Password
            </label>
            <div className="auth__input-wrapper">
              <input
                id="fp-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth__input"
                required
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="auth__input-icon auth__input-icon--button"
              >
                <Image
                  src={
                    showConfirmPassword
                      ? '/icons/eye-off.svg'
                      : '/icons/eye.svg'
                  }
                  alt=""
                  width={16}
                  height={16}
                />
              </button>
            </div>
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
            {isSubmitting ? (
              'Resetting…'
            ) : (
              <>
                <span>Reset Password</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      )}

      <div className="auth__back">
        <Link href="/login" className="auth__back-link">
          <span>←</span>
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
}
