# Auth — Login & Registration

The unauthenticated entry. Centered card on the warm background, Clerk-backed.
Already built (`src/components/features/auth/*`). Shown here for completeness.

```
            Login                                  Registration
┌─────────────────────────────┐        ┌─────────────────────────────┐
│ <Card> ──────────────────── │        │ <Card> ──────────────────── │
│  Welcome back               │        │  Create your account        │
│  Please enter your details… │        │  Get started with ClientPulse│
│                             │        │                             │
│  <Label> Business Email     │        │  <Label> First Name         │
│  [<Input> name@company  @]  │        │  [<Input> Jane ]            │
│  <Label> Password           │        │  <Label> Last Name          │
│  [<Input> •••••••••    👁]  │        │  [<Input> Smith]            │
│  [✓]<Checkbox> Remember  ↩  │        │  <Label> Business Email     │
│      <Btn brand>Forgot?     │        │  [<Input> name@company  @]  │
│                             │        │  <Label> Password           │
│  [<Button primary> Sign in] │        │  [<Input> •••••••••    👁]  │
│  ──── Or continue with ──── │        │  [<Button primary> Create]  │
│  [<Button secondary> Google]│        │  ──── Or continue with ──── │
│                             │        │  [<Button secondary> Google]│
│  Don't have an account?     │        │  Already have an account?   │
│  <a brand>Contact sales     │        │  <Link brand>Log in         │
└─────────────────────────────┘        └─────────────────────────────┘
```

## Components used

- `<Card>` ✅ — the centered auth container
- `<Label>` ✅ + `<Input>` ✅ — form fields (email shows `@`, password a show/hide 👁)
- `<Checkbox>` ✅ — "Remember me" (Login only)
- `<Button>` ✅ — primary submit (olive) + secondary Google
- brand-colored links ✅ — Forgot password / Contact sales / Log in (`text-brand`)
- Clerk `useSignIn` / `useSignUp` drive submission (logic already wired)
