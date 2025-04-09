
import React, { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <Search size={20} />
        </div>
        <Input
          type="text"
          placeholder="Enter multiple keywords separated by spaces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-24 py-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm"
        />
        <Button 
          type="submit"
          className="absolute right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2"
        >
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
