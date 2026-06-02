import Image from 'next/image';
import LoginForm from '@/components/features/auth/LoginForm/LoginForm';

const LoginPage = () => {
  const year = new Date().getFullYear();

  return (
    <div className="login">
      <main className="login__layout" aria-label="Sign in">
        <div className="login__panel">
          <div className="login-hero">
            <div className="login-hero__brand">
              <Image
                src="/icons/sparkles.svg"
                alt="Client Pulse"
                width={34}
                height={34}
              />
              <span>Client Pulse</span>
            </div>
            <h2 className="login-hero__heading">
              Intelligence that feels <em>human</em>.
            </h2>
            <p className="login-hero__body">
              Experience a growth platform designed with empathy and precision.
              Your dashboard is ready for your next move.
            </p>
          </div>
        </div>

        <div className="login__form-panel">
          <LoginForm />
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

export default LoginPage;
