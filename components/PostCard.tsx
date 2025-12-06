import React, { useState } from 'react';
import { Post } from '../types';
import CommentModal from './CommentModal';

interface PostCardProps {
    post: Post;
    onDelete: (postId: string) => void;
    onUpdate: (post: Post) => void;
}

const AVAILABLE_REACTIONS = ['👍', '❤️', '😂', '😯', '😢', '😠'];

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onUpdate }) => {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isReactionsOpen, setIsReactionsOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [animateReaction, setAnimateReaction] = useState<string | null>(null);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            onDelete(post.id);
        }
        setIsOptionsOpen(false);
    };

    const handleShare = () => {
        console.log(`Sharing post ${post.id}`);
    };
    
    const handleReaction = (emoji: string) => {
        const updatedReactions = [...post.reactions];
        const existingReaction = updatedReactions.find(r => r.emoji === emoji);

        if (existingReaction) {
            if (existingReaction.userReacted) {
                existingReaction.count--;
                existingReaction.userReacted = false;
            } else {
                existingReaction.count++;
                existingReaction.userReacted = true;
            }
        } else {
            updatedReactions.push({ emoji, count: 1, userReacted: true });
        }
        
        const filteredReactions = updatedReactions.filter(r => r.count > 0);
        
        onUpdate({ ...post, reactions: filteredReactions });
        setIsReactionsOpen(false);

        setAnimateReaction(emoji);
        setTimeout(() => setAnimateReaction(null), 400); // Shorten animation timeout
    };

    return (
        <>
            <style>{`
                @keyframes reaction-pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.4); }
                    100% { transform: scale(1); }
                }
                .animate-reaction-pop {
                    animation: reaction-pop 0.4s ease-out;
                }
            `}</style>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{post.author}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setIsOptionsOpen(!isOptionsOpen)} className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                        </button>
                        {isOptionsOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete Post</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-4 pb-2">
                    <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
                </div>
                {post.imageUrl && (
                    <div className="w-full bg-gray-100 dark:bg-gray-900">
                        <img src={post.imageUrl} alt="Post content" className="w-full max-h-[500px] object-contain" />
                    </div>
                )}
                
                <div className="p-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        {post.reactions.map(r => (
                            <span key={r.emoji} className={`inline-block ${animateReaction === r.emoji ? 'animate-reaction-pop' : ''}`}>{r.emoji}</span>
                        ))}
                        <span>{post.reactions.reduce((acc, r) => acc + r.count, 0)} reactions</span>
                    </div>
                    <div>
                        {post.comments.length} comments
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around">
                    <div className="relative w-1/3">
                         <button onClick={() => setIsReactionsOpen(!isReactionsOpen)} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.734V6a2 2 0 012-2h4a2 2 0 012 2v4z" /></svg>
                             React
                        </button>
                        {isReactionsOpen && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex gap-2 bg-white dark:bg-gray-600 p-2 rounded-full shadow-lg">
                                {AVAILABLE_REACTIONS.map(emoji => (
                                    <button key={emoji} onClick={() => handleReaction(emoji)} className="text-2xl hover:scale-125 transition-transform">
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsCommentsOpen(true)} className="w-1/3 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Comment
                    </button>
                     <button onClick={handleShare} className="w-1/3 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                         Share
                    </button>
                </div>
            </div>

            {isCommentsOpen && (
                <CommentModal 
                    post={post}
                    onClose={() => setIsCommentsOpen(false)} 
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
}

export default PostCard;