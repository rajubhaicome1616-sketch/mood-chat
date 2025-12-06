
import React, { useState, useRef } from 'react';
import { Post, Comment } from '../types';

interface CommentModalProps {
    post: Post;
    onClose: () => void;
    onUpdate: (post: Post) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, onClose, onUpdate }) => {
    const [newComment, setNewComment] = useState('');
    const [attachedImage, setAttachedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAttachedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            e.target.value = ''; // Reset file input
        }
    };

    const removeImage = () => {
        setAttachedImage(null);
        setImagePreviewUrl(null);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() && !attachedImage) return;

        const comment: Comment = {
            id: `c${Date.now()}`,
            author: 'Current User', // Hardcoded for demo
            avatar: 'https://picsum.photos/seed/user/32/32',
            text: newComment,
            timestamp: 'Just now',
            imageUrl: imagePreviewUrl || undefined,
        };

        onUpdate({ ...post, comments: [...post.comments, comment] });
        setNewComment('');
        removeImage();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Comments on {post.author}'s post</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {post.comments.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
                    ) : (
                        post.comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-3">
                                <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex-grow">
                                    <p className="font-semibold text-sm">{comment.author}</p>
                                    {comment.text && <p className="text-sm break-words">{comment.text}</p>}
                                    {comment.imageUrl && (
                                        <img src={comment.imageUrl} alt="Comment attachment" className="mt-2 rounded-lg max-w-xs h-auto" />
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{comment.timestamp}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t dark:border-gray-700">
                    {imagePreviewUrl && (
                        <div className="relative mb-2 w-fit">
                            <img src={imagePreviewUrl} alt="Image preview" className="max-h-24 rounded-lg" />
                            <button onClick={removeImage} className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleAddComment} className="flex gap-2 items-center">
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        </button>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 text-white rounded-full p-2.5 hover:bg-blue-700 disabled:bg-gray-400" disabled={!newComment.trim() && !attachedImage}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentModal;