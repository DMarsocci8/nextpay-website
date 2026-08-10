'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  useEffect(() => {
    const loadGoogleScript = async () => {
      // Load Google Sign-In script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: '166520787414-91msnnhh84pa7kavcuctiino56p4piae.apps.googleusercontent.com',
            callback: handleGoogleSignIn,
          });

          const buttonContainer = document.getElementById('google_signin_button');
          if (buttonContainer) {
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: 'outline',
              size: 'large',
              width: '350',
            });
          }
        }
      };

      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    try {
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await result.json();

      if (result.ok) {
        localStorage.setItem('session', JSON.stringify(data.session));
        window.location.href = '/';
      } else {
        alert('Sign in failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Sign in error:', error);
      alert('An error occurred during sign in');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '450px',
        width: '100%',
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Real Estate Portal
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '40px' }}>
          Sign in with your Google account
        </p>

        <div id="google_signin_button" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}></div>

        <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '24px' }}>
          <a href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
            Back to home
          </a>
        </p>
      </div>
    </div>
  );
}
