
import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import { performSearch } from '@/services/searchService';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

interface SearchSuggestion {
  name: string;
  description: string;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close the command dialog when Escape is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch suggestions as the user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8983/solr/mrs/select?indent=true&q.op=AND&useParams=&fl=name,description&q=search_all:${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (data.response && Array.isArray(data.response.docs)) {
          const newSuggestions = data.response.docs.map((doc: any) => ({
            name: doc.name,
            description: doc.description ? doc.description[0] : 'No description available'
          }));
          setSuggestions(newSuggestions);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setOpen(false);
    }
  };

  const handleSelectSuggestion = (selected: string) => {
    setSearchQuery(selected);
    onSearch(selected);
    setOpen(false);
  };

  const handleInputClick = () => {
    // Open the command dialog when input is clicked
    if (searchQuery.trim().length >= 2) {
      setOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400">
            <Search size={20} />
          </div>
          <Input
            type="text"
            placeholder="Enter multiple keywords separated by spaces... (e.g. vitamin d3 2000)"
            value={searchQuery}
            onChange={handleInputChange}
            onClick={handleInputClick}
            ref={inputRef}
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for medications..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? 'Loading suggestions...' : 'No results found.'}
          </CommandEmpty>
          <CommandGroup heading="Suggestions">
            {suggestions.map((suggestion, index) => (
              <CommandItem
                key={`${suggestion.name}-${index}`}
                onSelect={() => handleSelectSuggestion(suggestion.name)}
                className="flex flex-col items-start"
              >
                <span className="font-medium">{suggestion.name}</span>
                <span className="text-xs text-gray-500 truncate w-full">{suggestion.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
