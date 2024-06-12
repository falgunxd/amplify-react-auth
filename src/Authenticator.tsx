import { useState, FormEvent } from "react";
import { signUp, confirmSignUp, signIn, confirmSignIn } from 'aws-amplify/auth';
import './Authenticator.css';

export default function Authenticator({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'initial' | 'confirm'>('initial');

  const handlePhoneNumberSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (isSignUp) {
        await signUp({
          username: phoneNumber,
          password: "Aa@#" + phoneNumber,
          options: { userAttributes: { phone_number: phoneNumber } }
        });
      } else {
        await signIn({
          username: phoneNumber,
          password: "Aa@#" + phoneNumber,
        });
      }
      setStep('confirm');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleConfirmationSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (isSignUp) {
        await confirmSignUp({ username: phoneNumber, confirmationCode });
      } else {
        await confirmSignIn({ challengeResponse: confirmationCode });
      }
      onAuthSuccess();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="auth-card">
      <div className="toggle">
        <button onClick={() => setIsSignUp(true)}>Sign Up</button>
        <button onClick={() => setIsSignUp(false)}>Sign In</button>
      </div>
      {step === 'initial' ? (
        <form onSubmit={handlePhoneNumberSubmit}>
          <label htmlFor="phone_number">Phone Number:</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleConfirmationSubmit}>
          <label htmlFor="confirmationCode">Confirmation Code:</label>
          <input
            type="text"
            id="confirmationCode"
            name="confirmationCode"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
          />
          <p>A confirmation code is sent to your mobile number</p>
          <button type="submit">Verify</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
