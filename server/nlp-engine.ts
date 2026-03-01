// nlp-engine.ts
// This file contains functions for NLP processing capabilities.

// Function to perform tokenization
function tokenize(text: string): string[] {
    return text.split(/\s+/);
}

// Function to remove stop words
function removeStopWords(tokens: string[], stopWords: string[]): string[] {
    return tokens.filter(token => !stopWords.includes(token.toLowerCase()));
}

// Function to perform stemming
function stem(tokens: string[]): string[] {
    // Simple stemming logic (for demo purposes)
    return tokens.map(token => token.endsWith('ing') ? token.slice(0, -3) : token);
}

// Main NLP processing function
function processText(text: string, stopWords: string[]): string[] {
    const tokens = tokenize(text);
    const filteredTokens = removeStopWords(tokens, stopWords);
    return stem(filteredTokens);
}

export { tokenize, removeStopWords, stem, processText };