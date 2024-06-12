import { useState, useEffect } from "react";
import { signOut } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import Authenticator from './Authenticator';
import DisplayData from './DisplayData';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await fetchAuthSession();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuthStatus();
  }, []);

  return (
    <main>
      {isAuthenticated ? (
        <>
          <DisplayData />
          <button onClick={() => signOut().then(() => setIsAuthenticated(false))}>Sign out</button>
        </>
      ) : (
        <div className="auth-container">
          <div className="info">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <Authenticator onAuthSuccess={() => setIsAuthenticated(true)} />
        </div>
      )}
    </main>
  );
}
