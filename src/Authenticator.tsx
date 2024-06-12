import { useState, FormEvent } from "react";
import { signUp, confirmSignUp, signIn, confirmSignIn } from 'aws-amplify/auth';
import './Authenticator.css';

export default function Authenticator({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [step, setStep] = useState<'signUp' | 'confirmSignUp' | 'signIn' | 'confirmSignIn'>('signUp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await signUp({
        username: phoneNumber,
        password: "Aa@#" + phoneNumber,
        options: {
          userAttributes: { phone_number: phoneNumber }
        }
      });
      setStep('confirmSignUp');
    } catch (error) {
      setError('Error signing up');
    }
  }

  async function handleConfirmSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await confirmSignUp({
        username: phoneNumber,
        confirmationCode
      });
      setStep('signIn');
    } catch (error) {
      setError('Error confirming sign up');
    }
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { nextStep } = await signIn({
        username: phoneNumber,
        password: "Aa@#" + phoneNumber,
      });
      if (nextStep && nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        setStep('confirmSignIn');
      }
    } catch (error) {
      setError('Error signing in');
    }
  }

  async function handleConfirmSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await confirmSignIn({
        challengeResponse: confirmationCode,
      });
      onAuthenticated();
    } catch (error) {
      setError('Error confirming sign in');
    }
  }

  return (
    <div className="authenticator">
      {step === 'signUp' && (
        <form onSubmit={handleSignUp}>
          <label htmlFor="phone_number">Phone Number:</label>
          <input type="text" id="phone_number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          <input type="submit" value="Send OTP" />
        </form>
      )}
      {step === 'confirmSignUp' && (
        <form onSubmit={handleConfirmSignUp}>
          <p>A confirmation code is sent to your mobile number</p>
          <label htmlFor="confirmationCode">Confirmation Code:</label>
          <input type="text" id="confirmationCode" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} required />
          <input type="submit" value="Verify" />
        </form>
      )}
      {step === 'signIn' && (
        <form onSubmit={handleSignIn}>
          <label htmlFor="phone_number">Phone Number:</label>
          <input type="text" id="phone_number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          <input type="submit" value="Send OTP" />
        </form>
      )}
      {step === 'confirmSignIn' && (
        <form onSubmit={handleConfirmSignIn}>
          <p>A confirmation code is sent to your mobile number</p>
          <label htmlFor="confirmationCode">Confirmation Code:</label>
          <input type="text" id="confirmationCode" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} required />
          <input type="submit" value="Verify" />
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
