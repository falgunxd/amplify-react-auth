import { useState, useEffect, FormEvent } from "react";
import { signUp, confirmSignUp, signIn, confirmSignIn, signOut } from 'aws-amplify/auth';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import './App.css';

const client = generateClient<Schema>();

export default function App() {
  const [users, setUsers] = useState<Array<Schema["UserData"]["type"]>>([]);
  const [signUpStep, setSignUpStep] = useState<'initial' | 'confirm'>('initial');
  const [signInStep, setSignInStep] = useState<'initial' | 'confirm'>('initial');
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    client.models.UserData.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
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
        password: phone_number,
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
        password: phone_number,
      });
      if (nextStep && nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        setSignInStep('confirm');
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
      {signUpStep === 'initial' && (
        <form onSubmit={handleSignUp}>
          <label htmlFor="phone_number">Phone Number:</label>
          <input type="text" id="phone_number" name="phone_number" required />
          <input type="submit" value="Sign Up" />
        </form>
      )}
      {signUpStep === 'confirm' && (
        <form onSubmit={handleConfirmSignUp}>
          <label htmlFor="confirmationCode">Confirmation Code:</label>
          <input type="text" id="confirmationCode" name="confirmationCode" required />
          <input type="submit" value="Confirm Sign Up" />
        </form>
      )}
      {signInStep === 'initial' && (
        <form onSubmit={handleSignIn}>
          <label htmlFor="phone_number">Phone Number:</label>
          <input type="text" id="phone_number" name="phone_number" required />
          <input type="submit" value="Sign In" />
        </form>
      )}
      {signInStep === 'confirm' && (
        <form onSubmit={handleConfirmSignIn}>
          <label htmlFor="confirmationCode">Confirmation Code:</label>
          <input type="text" id="confirmationCode" name="confirmationCode" required />
          <input type="submit" value="Confirm Sign In" />
        </form>
      )}
      <button onClick={createUser}>+ new user</button>
      <ul>
        {users.map((user) => (
          <li
            onClick={() => deleteUser(user.id)}
            key={user.id}>{user.name} - {user.phone_number}</li>
        ))}
      </ul>
      <button onClick={() => signOut()}>Sign out</button>
    </main>
  );
}
