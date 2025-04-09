
import { SearchResult } from '@/types/search';

// This would be replaced with your actual API URL
const API_URL = 'https://example.com/api/search';

export async function performSearch(query: string): Promise<SearchResult[]> {
  try {
    // In a real implementation, this would make an actual API call
    // Replace this with your API integration
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
    
  } catch (error) {
    console.error("Error performing search:", error);
    
    // For demo purposes, return mock data if the API call fails
    return getMockResults(query);
  }
}

// Mock function to generate sample results for demonstration
function getMockResults(query: string): SearchResult[] {
  const mockResults: SearchResult[] = [
    {
      title: `Result about ${query}`,
      url: `https://example.com/result-1-about-${query.replace(/\s+/g, '-')}`,
      snippet: `This is a sample search result about ${query}. It provides information about the searched term and relates to the query in multiple ways.`
    },
    {
      title: `Learn more about ${query} - Comprehensive Guide`,
      url: `https://example.com/learn-about-${query.replace(/\s+/g, '-')}`,
      snippet: `A comprehensive guide about ${query} with detailed explanations, examples, and related information to help you understand the topic better.`
    },
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${query.replace(/\s+/g, '_')}`,
      snippet: `${query} refers to a concept, term, or entity that has various meanings and applications in different contexts. Learn about its history, development, and significance.`
    }
  ];
  
  return mockResults;
}
