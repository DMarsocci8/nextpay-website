'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      // Handle fetch errors and other exceptions
      if (err?.message?.includes('ISO-8859-1')) {
        setError('Connection error. Please refresh and try again.');
      } else if (err instanceof TypeError) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err?.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="card bg-white shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-600 text-sm mt-1">Real Estate Portal</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-accent w-full"
                disabled={loading}
              >
                {loading ? <span className="spinner mr-2"></span> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
                  Create one
                </Link>
              </p>
              <p className="text-center text-gray-600 text-sm mt-4">
                <Link href="/" className="text-blue-600 font-semibold hover:underline">
                  Back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
