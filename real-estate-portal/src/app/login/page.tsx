'use client';

import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { theme: 'outline', size: 'large', width: '300' }
        );
      }
    };
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    setLoading(true);
    setError('');

    try {
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await result.json();

      if (!result.ok) {
        setError(data.error || 'Failed to sign in with Google');
      } else {
        // Store session and redirect
        localStorage.setItem('session', JSON.stringify(data.session));
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #111827, #1f2937)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '448px', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Real Estate Portal</h1>
            <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '32px' }}>Sign in with your Google account</p>

            {error && (
              <div style={{ marginBottom: '24px', padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', color: '#b91c1c', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div id="googleSignInButton" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}></div>

            <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '12px', marginTop: '16px' }}>
              <a href="/" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
                Back to home
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
