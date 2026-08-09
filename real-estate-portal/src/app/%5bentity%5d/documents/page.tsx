import React from 'react';
import { notFound } from 'next/navigation';
import DocumentManager from '@/components/documents/DocumentManager';
import { supabaseAdmin } from '@/lib/supabase';

interface DocumentsPageProps {
  params: Promise<{
    entity: string;
  }>;
}

export async function generateMetadata({ params }: DocumentsPageProps) {
  const { entity } = await params;
  return {
    title: `Documents | ${entity}`,
    description: 'Manage and organize your entity documents',
  };
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { entity } = await params;

  // Fetch entity details
  const { data: entityData, error: entityError } = await supabaseAdmin
    .from('entities')
    .select('id, name, slug')
    .eq('slug', entity)
    .single();

  if (entityError || !entityData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DocumentManager
          entityId={entityData.id}
          entitySlug={entityData.slug}
          title={`${entityData.name} - Document Management`}
        />
      </div>
    </div>
  );
}
