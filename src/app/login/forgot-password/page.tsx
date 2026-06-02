'use client';

import { useState } from 'react';
import ForgotPasswordForm, {
  STEPS,
} from '@/components/features/auth/ForgotPasswordForm/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const year = new Date().getFullYear();
  const [stepIndex, setStepIndex] = useState(0);

  return (
    <div className="forgot-password">
      <main className="forgot-password__main" aria-label="Reset password">
        <ForgotPasswordForm onStepChange={setStepIndex} />

        <div className="forgot-password__steps" aria-label="Step indicator">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`forgot-password__step${stepIndex === i ? ' forgot-password__step--active' : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </main>

      <footer className="login-footer">
        <div className="login-footer__left">
          <span className="login-footer__brand">Client Pulse</span>
          <span className="login-footer__sep" aria-hidden="true">
            |
          </span>
          <span>© {year} Client Pulse. All rights reserved.</span>
        </div>
        <nav className="login-footer__nav" aria-label="Footer">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Security</a>
          <a href="#">Cookie Settings</a>
        </nav>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
