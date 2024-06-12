import { useState, useEffect, FormEvent } from "react";
import { signUp, confirmSignUp, signIn, confirmSignIn, signOut } from 'aws-amplify/auth';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import './App.css';
import DisplayData from './DisplayData';

const client = generateClient<Schema>();

export default function App() {
  const [users, setUsers] = useState<Array<{ id: string; name: string; phone_number: string }>>([]);
  const [signUpStep, setSignUpStep] = useState<'initial' | 'confirm'>('initial');
  const [signInStep, setSignInStep] = useState<'initial' | 'confirm'>('initial');
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    client.models.UserData.observeQuery().subscribe({
      next: (data) => setUsers(data.items.map((user: any) => ({
        id: user.id,
        name: user.name || '',
        phone_number: user.phone_number || ''
      }))),
    });
  }, []);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const phone_number = form.phone_number.value;
    setUsername(phone_number);

    try {
      await signUp({
        username: phone_number,
        password: "Aa@#" + phone_number,
        options: {
          userAttributes: { phone_number }
        }
      });
      setSignUpStep('confirm');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }

  async function handleConfirmSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const confirmationCode = form.confirmationCode.value;

    try {
      await confirmSignUp({
        username,
        confirmationCode
      });
      alert("Sign up confirmed!");
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error confirming sign up:', error);
    }
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const phone_number = form.phone_number.value;
    setUsername(phone_number);

    try {
      const { nextStep } = await signIn({
        username: phone_number,
        password: "Aa@#" + phone_number,
      });
      if (nextStep && nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        setSignInStep('confirm');
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  }

  async function handleConfirmSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const confirmationCode = form.confirmationCode.value;

    try {
      await confirmSignIn({
        challengeResponse: confirmationCode,
      });
      alert("Sign in confirmed!");
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error confirming sign in:', error);
    }
  }

  function createUser() {
    const name = window.prompt("Name");
    const phone_number = window.prompt("Phone number");
    const height = Number(window.prompt("Height"));
    const weight = Number(window.prompt("Weight"));
    const date_of_birth = window.prompt("Date of birth");
    client.models.UserData.create({ name, phone_number, height, weight, date_of_birth });
  }

  function deleteUser(id: string) {
    client.models.UserData.delete({ id });
  }

  return (
    <main>
      {isAuthenticated ? (
        <div>
          <DisplayData users={users} deleteUser={deleteUser} />
          <button onClick={createUser}>+ new user</button>
          <button onClick={() => {
            signOut();
            setIsAuthenticated(false);
          }}>Sign out</button>
        </div>
      ) : (
        <div className="auth-container">
          <div className="left">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
          </div>
          <div className="right">
            {signUpStep === 'initial' && (
              <form onSubmit={handleSignUp}>
                <label htmlFor="phone_number">Phone Number:</label>
                <input type="text" id="phone_number" name="phone_number" required />
                <input type="submit" value="Send OTP" />
              </form>
            )}
            {signUpStep === 'confirm' && (
              <form onSubmit={handleConfirmSignUp}>
                <p>A confirmation code is sent to your mobile number</p>
                <label htmlFor="confirmationCode">Confirmation Code:</label>
                <input type="text" id="confirmationCode" name="confirmationCode" required />
                <input type="submit" value="Verify" />
              </form>
            )}
            {signInStep === 'initial' && (
              <form onSubmit={handleSignIn}>
                <label htmlFor="phone_number">Phone Number:</label>
                <input type="text" id="phone_number" name="phone_number" required />
                <input type="submit" value="Send OTP" />
              </form>
            )}
            {signInStep === 'confirm' && (
              <form onSubmit={handleConfirmSignIn}>
                <p>A confirmation code is sent to your mobile number</p>
                <label htmlFor="confirmationCode">Confirmation Code:</label>
                <input type="text" id="confirmationCode" name="confirmationCode" required />
                <input type="submit" value="Verify" />
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
