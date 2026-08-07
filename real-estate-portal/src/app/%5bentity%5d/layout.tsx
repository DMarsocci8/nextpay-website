'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Entity, EntitySlug } from '@/types';

export default function EntityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const entitySlug = params.entity as EntitySlug;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Fetch entity
      const { data } = await supabase
        .from('entities')
        .select('*')
        .eq('slug', entitySlug)
        .single();

      if (data) {
        setEntity(data);
      }

      setLoading(false);
    };

    checkUser();
  }, [entitySlug, router]);

  if (loading) {
    return (
      <div className="flex-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="flex-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Entity not found</h1>
          <Link href="/">
            <button className="btn btn-accent">Go Back Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50" style={{ '--accent-color': entity.accent_color } as any}>
      {/* Sidebar */}
      <aside
        className="w-64 bg-white border-r border-gray-200 shadow-sm"
        style={{ borderLeftColor: entity.accent_color, borderLeftWidth: '4px' }}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{entity.name}</h2>
          <p className="text-xs text-gray-600 mt-1">Portfolio Management</p>
        </div>

        <nav className="p-4 space-y-2">
          <Link href={`/${entitySlug}`}>
            <div
              className="p-3 rounded hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
              style={{ borderLeftColor: entity.accent_color, borderLeftWidth: '3px' }}
            >
              📊 Dashboard
            </div>
          </Link>

          <Link href={`/${entitySlug}/properties`}>
            <div
              className="p-3 rounded hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
              style={{ borderLeftColor: entity.accent_color, borderLeftWidth: '3px' }}
            >
              🏠 Properties
            </div>
          </Link>

          <Link href={`/${entitySlug}/documents`}>
            <div
              className="p-3 rounded hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
              style={{ borderLeftColor: entity.accent_color, borderLeftWidth: '3px' }}
            >
              📄 Documents
            </div>
          </Link>

          <Link href={`/${entitySlug}/financials`}>
            <div
              className="p-3 rounded hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
              style={{ borderLeftColor: entity.accent_color, borderLeftWidth: '3px' }}
            >
              💰 Financials
            </div>
          </Link>

          <Link href={`/${entitySlug}/settings`}>
            <div
              className="p-3 rounded hover:bg-gray-100 cursor-pointer text-gray-700 font-medium"
              style={{ borderLeftColor: entity.accent_color, borderLeftWidth: '3px' }}
            >
              ⚙️ Settings
            </div>
          </Link>
        </nav>

        <div className="absolute bottom-4 left-4 right-4 p-4 bg-gray-100 rounded border-l-4" style={{ borderLeftColor: entity.accent_color }}>
          <p className="text-xs text-gray-700 font-medium">{user?.email}</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="text-xs text-gray-600 hover:text-gray-900 mt-2 font-semibold"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex-between">
            <h1 className="text-2xl font-bold text-gray-900">{entity.name}</h1>
            <div className="flex gap-4">
              <Link href="/">
                <button className="btn btn-ghost btn-sm">← All Entities</button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
