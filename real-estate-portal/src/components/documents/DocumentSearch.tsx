'use client';

import React, { useState, useCallback } from 'react';
import { DocumentType } from '@/types';
import { DOCUMENT_TYPE_LABELS } from '@/lib/document-utils';

interface DocumentSearchProps {
  onSearch: (filters: {
    query?: string;
    types?: DocumentType[];
    tags?: string[];
    year?: string;
  }) => void;
  isLoading?: boolean;
}

export default function DocumentSearch({
  onSearch,
  isLoading,
}: DocumentSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<DocumentType>>(
    new Set()
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [year, setYear] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeToggle = useCallback((type: DocumentType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }, []);

  const handleSearch = useCallback(() => {
    onSearch({
      query: query || undefined,
      types: selectedTypes.size > 0 ? Array.from(selectedTypes) : undefined,
      tags: selectedTags.size > 0 ? Array.from(selectedTags) : undefined,
      year: year || undefined,
    });
  }, [query, selectedTypes, selectedTags, year, onSearch]);

  const handleClear = () => {
    setQuery('');
    setSelectedTypes(new Set());
    setSelectedTags(new Set());
    setYear('');
    onSearch({});
  };

  const hasActiveFilters =
    query || selectedTypes.size > 0 || selectedTags.size > 0 || year;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search documents by name or description..."
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? '🔄' : '🔍'}
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {isExpanded ? '▲' : '▼'} Filters
        </button>
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Document type filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Document Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.has(value as DocumentType)}
                    onChange={() =>
                      handleTypeToggle(value as DocumentType)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Year filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min={1990}
              max={new Date().getFullYear()}
              placeholder="e.g., 2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Common Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {['important', 'quarterly', 'annual', 'followup', 'archived'].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTags.has(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-600">Active filters:</span>
          {query && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Search: "{query}"
            </span>
          )}
          {selectedTypes.size > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Types: {selectedTypes.size}
            </span>
          )}
          {year && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Year: {year}
            </span>
          )}
          {selectedTags.size > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Tags: {selectedTags.size}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
