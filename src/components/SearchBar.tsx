
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

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
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
    setOpen(true);
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
            placeholder="Enter multiple keywords separated by spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {suggestions.map((suggestion) => (
              <CommandItem
                key={suggestion}
                onSelect={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
