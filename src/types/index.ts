// src/types.ts

// Type for a single chat message
export type Message = {
  id: string;
  content: string;
  timestamp: Date;
  role: 'user' | 'assistant'; // Use 'role' instead of 'isUser'
};

// Type for a user
export type User = {
  name: string;
  email: string;
};

// Type for a saved chat session in the sidebar
export type ChatSession = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
};

export type Theme = 'light' | 'dark';

// en tu archivo src/types.ts o similar
