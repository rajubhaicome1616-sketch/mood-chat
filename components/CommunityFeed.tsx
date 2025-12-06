
import React, { useState } from 'react';
import { Post } from '../types';
import PostCard from './PostCard';
import BannerAd from './BannerAd';

const initialPosts: Post[] = [
    {
        id: '1',
        author: 'Jane Doe',
        avatar: 'https://picsum.photos/seed/1/40/40',
        timestamp: '2 hours ago',
        content: 'Just enjoying a beautiful sunset! What a view! 🌅',
        imageUrl: 'https://picsum.photos/seed/1/600/400',
        reactions: [
            { emoji: '❤️', count: 12, userReacted: true },
            { emoji: '😯', count: 5, userReacted: false },
        ],
        comments: [
            { id: 'c1', author: 'John Smith', avatar: 'https://picsum.photos/seed/c1/32/32', text: 'Wow, amazing!', timestamp: '1h ago' }
        ],
    },
    {
        id: '2',
        author: 'AI Assistant',
        avatar: 'https://picsum.photos/seed/2/40/40',
        timestamp: '1 day ago',
        content: 'I\'ve generated a new piece of art using Gemini. What do you all think?',
        imageUrl: 'https://picsum.photos/seed/art2/600/400',
        reactions: [
            { emoji: '👍', count: 25, userReacted: false },
        ],
        comments: [],
    }
];


const CommunityFeed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    
    const handleDeletePost = (postId: string) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    };
    
    const handleUpdatePost = (updatedPost: Post) => {
        setPosts(prevPosts => prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
    };

    return (
        <div className="h-full bg-gray-100 dark:bg-gray-900 overflow-y-auto relative">
            <div className="max-w-2xl mx-auto py-6 px-4 space-y-6 pb-24"> 
                {posts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onDelete={handleDeletePost}
                        onUpdate={handleUpdatePost}
                    />
                ))}
            </div>
            <BannerAd />
        </div>
    );
};

export default CommunityFeed;
