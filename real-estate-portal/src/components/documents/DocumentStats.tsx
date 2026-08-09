'use client';

import React, { useEffect, useState } from 'react';
import { formatFileSize } from '@/lib/document-utils';

interface DocumentStatsData {
  total_documents: number;
  total_size_mb: string;
  type_stats: Record<string, number>;
  year_stats: Record<string, number>;
  property_stats: Record<string, number>;
  storage_usage?: {
    totalFiles: number;
    totalSizeGB: number;
  };
  recent_documents: Array<{
    id: string;
    file_name: string;
    document_type: string;
    file_size: number;
    created_at: string;
  }>;
}

interface DocumentStatsProps {
  entityId: string;
  entitySlug?: string;
}

export default function DocumentStats({
  entityId,
  entitySlug,
}: DocumentStatsProps) {
  const [stats, setStats] = useState<DocumentStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams({ entity_id: entityId });
        if (entitySlug) {
          params.append('entity_slug', entitySlug);
        }

        const response = await fetch(`/api/documents/stats?${params}`);
        if (!response.ok) throw new Error('Failed to fetch stats');

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [entityId, entitySlug]);

  if (isLoading) {
    return <div className="text-center py-8">Loading statistics...</div>;
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load statistics: {error}
      </div>
    );
  }

  const topDocumentTypes = Object.entries(stats.type_stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topYears = Object.entries(stats.year_stats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="text-sm font-medium text-blue-900 mb-1">
            Total Documents
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {stats.total_documents}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="text-sm font-medium text-purple-900 mb-1">
            Storage Used
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {stats.total_size_mb} MB
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="text-sm font-medium text-green-900 mb-1">
            Document Types
          </div>
          <div className="text-3xl font-bold text-green-600">
            {Object.keys(stats.type_stats).length}
          </div>
        </div>
      </div>

      {/* Top document types */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Documents by Type
        </h3>
        <div className="space-y-3">
          {topDocumentTypes.map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                <span className="text-gray-700 capitalize font-medium">
                  {type}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(count / stats.total_documents) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-gray-600 font-semibold">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top years */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Documents by Year
        </h3>
        <div className="space-y-3">
          {topYears.map(([year, count]) => (
            <div key={year} className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{year}</span>
              <div className="flex items-center gap-4">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${(count / Math.max(...Object.values(stats.year_stats))) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-gray-600 font-semibold">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent documents */}
      {stats.recent_documents.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recently Uploaded
          </h3>
          <div className="space-y-3">
            {stats.recent_documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <p className="text-gray-900 font-medium truncate">
                    {doc.file_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.document_type} · {formatFileSize(doc.file_size)}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
