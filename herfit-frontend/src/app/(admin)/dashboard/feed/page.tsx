'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import dayjs from 'dayjs';

type Post = {
    id: number;
    user_name: string;
    caption: string;
    image_url: string | null;
    created_at: string;
    likes_count: number;
    is_liked: boolean;
    comments: { id: number; user_name: string; content: string }[];
};

export default function HerFeedPage() {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/herfeed-posts');
            console.log(res.data);
            setPosts(res.data.data);
        } catch (err) {
            console.error("Fetch herfeed-posts error:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!caption.trim() && !image) return;

        const formData = new FormData();
        formData.append('caption', caption);
        if (image) formData.append('image', image);

        try {
            setLoading(true);
            await axios.post('/herfeed-posts', formData);
            setCaption('');
            setImage(null);
            fetchPosts();
        } catch (error) {
            console.error('Post error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId: number) => {
        try {
            await axios.post('/herfeed-likes/toggle', { fitness_post_id: postId });
            fetchPosts();
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    const handleComment = async (postId: number) => {
        const content = commentInputs[postId];
        if (!content?.trim()) return;

        try {
            await axios.post('/herfeed-comments', {
                fitness_post_id: postId,
                comment: content,
            });
            setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
            fetchPosts();
        } catch (error) {
            console.error('Comment error:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">HerFeed</h1>

            <form onSubmit={handlePostSubmit} className="bg-white shadow-md rounded-lg p-4 space-y-4 border">
                <textarea
                    placeholder="Bagikan progres latihanmu..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="text-sm"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-all duration-150 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Posting...' : 'Posting'}
                </button>
            </form>

            {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">{post.user_name}</span>
                        <span className="text-sm text-gray-500">
                            {dayjs(post.created_at).format('DD MMM YYYY HH:mm')}
                        </span>
                    </div>
                    <p className="text-gray-700">{post.caption}</p>
                    {post.image_url && (
                        <img
                            src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${post.image_url}`}
                            alt="Post"
                            className="w-full rounded-md border object-cover"
                        />
                    )}
                    <div className="flex items-center gap-4 mb-2">
                        <button
                            onClick={() => handleLike(post.id)}
                            className="text-sm hover:underline"
                        >
                            {post.is_liked ? '💔 Unlike' : '❤️ Like'} ({post.likes_count})
                        </button>
                    </div>

                    <div className="space-y-2 pt-2">
                        {post.comments?.map((c) => (
                            <div key={c.id} className="text-sm text-gray-800">
                                <span className="font-semibold">{c.user_name}:</span> {c.content}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <input
                            type="text"
                            placeholder="Tulis komentar..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                                setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.id]: e.target.value,
                                }))
                            }
                            className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                        />
                        <button
                            onClick={() => handleComment(post.id)}
                            className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded-md"
                        >
                            Kirim
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}