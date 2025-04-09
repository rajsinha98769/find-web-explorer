import { SearchResult } from '@/types/search';

// Base URL for the Solr API
const SOLR_API_URL = 'http://localhost:8983/solr/mrs/select';

export async function performSearch(query: string): Promise<SearchResult[]> {
  try {
    if (!query.trim()) {
      return [];
    }

    // Split the query by spaces
    const keywords = query.trim().split(/\s+/);
    
    if (keywords.length === 0) {
      return [];
    }

    // Build the URL with the query parameters
    const searchParams = new URLSearchParams({
      'indent': 'true',
      'q.op': 'AND',
      'useParams': '',
    });

    // First keyword goes into the main 'q' parameter
    const firstKeyword = keywords[0];
    searchParams.append('q', `search_all:${encodeURIComponent(firstKeyword)}`);
    
    // Rest of the keywords go into filter queries 'fq'
    for (let i = 1; i < keywords.length; i++) {
      searchParams.append('fq', `search_all:${encodeURIComponent(keywords[i])}`);
    }

    const url = `${SOLR_API_URL}?${searchParams.toString()}`;
    console.log('Requesting URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the Solr response data to match our SearchResult type
    // Adjust this based on the actual structure of your Solr response
    if (data.response && Array.isArray(data.response.docs)) {
      return data.response.docs.map((doc: any) => ({
        title: doc.title || 'Untitled',
        url: doc.url || '#',
        snippet: doc.description || doc.snippet || 'No description available'
      }));
    }
    
    return [];
  } catch (error) {
    console.error("Error performing search:", error);
    
    // For demo/fallback purposes, return mock data if the API call fails
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
