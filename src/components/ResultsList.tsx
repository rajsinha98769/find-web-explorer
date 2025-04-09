
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchResult } from '@/types/search';

interface ResultsListProps {
  results: SearchResult[];
}

const ResultsList = ({ results }: ResultsListProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium text-gray-700">No results found</h2>
        <p className="text-gray-500 mt-2">Try another search term</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-700 mb-4">
        {results.length} Search Results
      </h2>
      
      {results.map((result, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-600 text-lg hover:underline">
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
            </CardTitle>
            <p className="text-sm text-green-700 truncate">{result.url}</p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{result.snippet}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default ResultsList;
