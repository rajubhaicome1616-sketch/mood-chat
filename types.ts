
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  imageUrl?: string;
  sources?: GroundingSource[];
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export enum Mood {
  Neutral = 'neutral',
  Happy = 'happy',
  Sad = 'sad',
  Angry = 'angry',
}

export enum View {
    CHAT = 'Chat',
    LIVE = 'Live Conversation',
    COMMUNITY = 'Community',
    ABOUT = 'About'
}

export interface Reaction {
    emoji: string;
    count: number;
    userReacted: boolean;
}

export interface Comment {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: string;
    imageUrl?: string;
}

export interface Post {
    id: string;
    author: string;
    avatar: string;
    timestamp: string;
    content: string;
    imageUrl?: string;
    reactions: Reaction[];
    comments: Comment[];
}