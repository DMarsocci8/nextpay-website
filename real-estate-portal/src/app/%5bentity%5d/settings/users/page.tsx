'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { Entity, User } from '@/types';

export default function UsersPage() {
  const params = useParams();
  const entitySlug = params.entity as string;
  const [entity, setEntity] = useState<Entity | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'collaborator'>('collaborator');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);

      // Get entity
      const { data: entityData } = await supabase
        .from('entities')
        .select('*')
        .eq('slug', entitySlug)
        .single();

      if (entityData) {
        setEntity(entityData);
      }

      // Get all users
      const { data: usersData } = await supabase.from('users').select('*');

      if (usersData) {
        setUsers(usersData);
      }

      setLoading(false);
    };

    fetchData();
  }, [entitySlug]);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      // In production, this would send an email invitation
      // For now, we'll create the user account and log it

      // First, try to create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: inviteEmail,
        password: Math.random().toString(36).slice(-12), // Temporary password
        email_confirm: true,
      });

      if (authError && authError.message.includes('already exists')) {
        // User already exists, just add to users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', inviteEmail)
          .single();

        if (!existingUser) {
          // Get the auth user ID from email lookup
          alert(
            `⚠️ User ${inviteEmail} already exists in the system.\n\nThey should check their email for an invitation link.`
          );
        }
      } else if (authError) {
        throw authError;
      } else if (authData?.user) {
        // Create user record in database
        const { error: dbError } = await supabase.from('users').insert([
          {
            auth_id: authData.user.id,
            email: inviteEmail,
            role: inviteRole,
          },
        ]);

        if (dbError) {
          throw dbError;
        }

        alert(
          `✅ Invitation sent to ${inviteEmail}!\n\nThey will receive an email to set their password.`
        );

        // Refresh users list
        const { data: usersData } = await supabase.from('users').select('*');
        if (usersData) {
          setUsers(usersData);
        }

        // Reset form
        setInviteEmail('');
        setInviteRole('collaborator');
      }
    } catch (err) {
      console.error(err);
      alert(`Error inviting user: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;

    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);

      if (error) throw error;

      // Refresh users list
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) {
        setUsers(usersData);
      }

      alert('✅ User removed');
    } catch (err) {
      console.error(err);
      alert(`Error removing user: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Team Members</h2>

      {/* Invite New User */}
      <div className="card mb-8">
        <h3 className="card-title mb-6">Invite Team Member</h3>
        <form onSubmit={handleInviteUser} className="space-y-4">
          <div className="grid_2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="matt@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={inviting}
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                className="input"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                disabled={inviting}
              >
                <option value="collaborator">Collaborator (Full Access)</option>
                <option value="owner">Owner (Admin)</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Both roles have full read/write access
              </p>
            </div>
          </div>

          <button type="submit" className="btn btn-accent" disabled={!inviteEmail || inviting}>
            {inviting ? 'Sending Invitation...' : '👤 Send Invitation'}
          </button>
        </form>
      </div>

      {/* Current Users */}
      <div className="card">
        <h3 className="card-title mb-6">Active Members ({users.length})</h3>

        {users.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-600">No team members yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 border border-gray-200 rounded flex-between hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user.full_name || user.email}</p>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.role === 'owner' ? '👑 Owner' : '👤 Collaborator'} • Joined{' '}
                    {formatDate(user.created_at)}
                  </p>
                </div>

                <div className="flex gap-2">
                  {user.auth_id !== currentUser?.id && (
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="btn btn-ghost btn-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                  {user.auth_id === currentUser?.id && (
                    <span className="badge badge-primary">You</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permissions Guide */}
      <div className="card mt-8 bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">📋 Permission Levels</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div>
            <p className="font-medium">👑 Owner</p>
            <p>Full access to all entities, documents, and settings. Can manage team members.</p>
          </div>
          <div>
            <p className="font-medium">👤 Collaborator</p>
            <p>Full access to all entities, documents, and settings (same as Owner).</p>
          </div>
        </div>
        <p className="text-xs text-blue-700 mt-4">
          💡 Tip: Both roles have equal access. The "Owner" label is for organizational purposes.
        </p>
      </div>
    </div>
  );
}
