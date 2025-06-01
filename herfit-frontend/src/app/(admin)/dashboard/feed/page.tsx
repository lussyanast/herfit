'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';

const POSTS_PER_PAGE = 5;

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
    const [preview, setPreview] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/herfeed-posts');
            const sortedPosts = res.data.data.sort((a: Post, b: Post) => {
                return sortOrder === 'asc'
                    ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            setPosts(sortedPosts);
        } catch (err) {
            console.error('Fetch herfeed-posts error:', err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [sortOrder]);

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
            setPreview(null);
            fetchPosts();
        } catch (error) {
            console.error('Post error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (file: File | null) => {
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
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

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const paginatedPosts = posts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-2xl mx-auto px-4 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-extrabold text-pink-700">💖 HerFeed</h1>
                    <select
                        className="border text-sm rounded-md p-1"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                        <option value="desc">Terbaru</option>
                        <option value="asc">Terlama</option>
                    </select>
                </div>

                <form onSubmit={handlePostSubmit} className="bg-white border shadow rounded-xl p-5 space-y-4">
                    <textarea
                        placeholder="Bagikan progres latihanmu..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                        className="text-sm text-gray-600"
                    />
                    {preview && (
                        <div className="relative w-full">
                            <img src={preview} alt="Preview" className="rounded-lg w-full max-h-60 object-cover border" />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-1 right-1 bg-pink-600 text-white rounded-full p-1 shadow hover:bg-pink-700"
                                aria-label="Remove preview image"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Posting...' : 'Posting'}
                    </button>
                </form>

                {paginatedPosts.map((post) => (
                    <div key={post.id} className="bg-white border shadow rounded-lg p-5 space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-sm uppercase">
                                    {post.user_name[0]}
                                </div>
                                <div className="text-sm font-semibold text-gray-800">{post.user_name}</div>
                            </div>
                            <div className="text-xs text-gray-500">{dayjs(post.created_at).format('DD MMM YYYY HH:mm')}</div>
                        </div>
                        <p className="text-gray-700 text-sm">{post.caption}</p>
                        {post.image_url && (
                            <img
                                src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${post.image_url}`}
                                alt="Post"
                                className="w-full max-h-80 object-cover rounded-lg border"
                            />
                        )}
                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={() => handleLike(post.id)}
                                className="text-sm text-pink-600 hover:underline"
                            >
                                {post.is_liked ? '💔 Unlike' : '❤️ Like'} ({post.likes_count})
                            </button>
                        </div>
                        <div className="border-t pt-3 space-y-2 text-sm">
                            {post.comments.map((c) => (
                                <div key={c.id} className="text-gray-700">
                                    <span className="font-semibold text-gray-800">{c.user_name}:</span> {c.content}
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
                                className="flex-1 border border-gray-300 p-2 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                            />
                            <button
                                onClick={() => handleComment(post.id)}
                                className="bg-pink-100 hover:bg-pink-200 text-pink-800 text-sm px-3 py-1 rounded-md"
                            >
                                Kirim
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex justify-center gap-3 pt-6">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-1 bg-pink-100 rounded-md text-pink-700 hover:bg-pink-200 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-1 bg-pink-100 rounded-md text-pink-700 hover:bg-pink-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}