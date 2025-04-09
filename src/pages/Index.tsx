
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ResultsList from '@/components/ResultsList';
import { useToast } from '@/components/ui/use-toast';
import { performSearch } from '@/services/searchService';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setQuery(searchQuery);
    
    try {
      const searchResults = await performSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* Header with logo */}
      <header className="w-full py-6 flex justify-center">
        <h1 className="text-3xl font-bold text-blue-600">Web Explorer</h1>
      </header>
      
      {/* Search section */}
      <main className="w-full max-w-3xl px-4 flex-1">
        <div className="mt-8 mb-16">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {/* Results or welcome message */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : query ? (
          <ResultsList results={results} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Search the web to find what you're looking for
            </p>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Web Explorer Search</p>
      </footer>
    </div>
  );
};

export default Index;
