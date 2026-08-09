'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex-center min-h-screen">
          <div className="w-full max-w-md">
            <div className="card bg-white shadow-xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Real Estate Portal</h1>
                <p className="text-gray-600">Portfolio Management Hub</p>
              </div>

              <div className="space-y-4">
                <Link href="/login">
                  <button className="btn btn-accent w-full">Sign In</button>
                </Link>
                <Link href="/signup">
                  <button className="btn btn-secondary w-full">Create Account</button>
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">Entities</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">10+</div>
                    <div className="text-sm text-gray-600">Properties</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">80+</div>
                    <div className="text-sm text-gray-600">Data Tabs</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-8">
              Real Estate Hub • Private Portal
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Select an entity to get started</p>
        </div>

        <div className="grid-auto">
          <Link href="/doma_capital">
            <div className="card hover:shadow-lg cursor-pointer border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Doma Capital</h3>
              <p className="text-gray-600 text-sm mb-4">3734 Monroe Road</p>
              <div className="flex-between">
                <span className="badge badge-primary">1 Property</span>
                <span className="text-blue-600 font-semibold">→</span>
              </div>
            </div>
          </Link>

          <Link href="/domillo_holdings">
            <div className="card hover:shadow-lg cursor-pointer border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Domillo Holdings</h3>
              <p className="text-gray-600 text-sm mb-4">Multi-property portfolio</p>
              <div className="flex-between">
                <span className="badge badge-success">6 Properties</span>
                <span className="text-green-600 font-semibold">→</span>
              </div>
            </div>
          </Link>

          <Link href="/jagg">
            <div className="card hover:shadow-lg cursor-pointer border-l-4 border-amber-600">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Jones & Green Group</h3>
              <p className="text-gray-600 text-sm mb-4">Buckner properties</p>
              <div className="flex-between">
                <span className="badge badge-warning">2 Properties</span>
                <span className="text-amber-600 font-semibold">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
