'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';

type Post = {
    id_postingan: number;
    user_name: string;
    caption: string;
    foto_postingan: string | null;
    created_at: string;
    likes_count: number;
    is_liked: boolean;
    comments: { id_interaksi: number; user_name: string; isi_komentar: string }[];
};

export default function HerFeedPage() {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('/herfeed-posts');
            setPosts(res.data.data);
        } catch (err) {
            console.error('Gagal memuat postingan', err);
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
            setPreview(null);
            fetchPosts();
        } catch (err) {
            console.error('Gagal posting', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (file: File | null) => {
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleLike = async (id_postingan: number) => {
        try {
            await axios.post('/herfeed-likes/toggle', { id_postingan });
            fetchPosts();
        } catch (err) {
            console.error('Gagal like postingan', err);
        }
    };

    const handleComment = async (id_postingan: number) => {
        const content = commentInputs[id_postingan];
        if (!content?.trim()) return;

        try {
            await axios.post('/herfeed-comments', {
                id_postingan,
                isi_komentar: content,
            });
            setCommentInputs((prev) => ({ ...prev, [id_postingan]: '' }));
            fetchPosts();
        } catch (err) {
            console.error('Gagal komentar', err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-10">
            <h1 className="text-3xl font-bold text-center text-pink-600">HerFeed</h1>

            <form
                onSubmit={handlePostSubmit}
                className="space-y-4 bg-white p-6 rounded-lg shadow-md border"
            >
                <textarea
                    placeholder="Bagikan progres latihanmu..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full border p-3 rounded-md resize-none focus:outline-none focus:ring focus:ring-gray-400"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    className="text-sm text-gray-600"
                />
                {preview && (
                    <div className="relative mt-2">
                        <img src={preview} alt="preview" className="w-full rounded-md border" />
                        <button
                            type="button"
                            onClick={() => handleImageChange(null)}
                            className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-red-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-700 text-white py-2 rounded-md transition"
                >
                    {loading ? 'Posting...' : 'Posting'}
                </button>
            </form>

            {posts.map((post) => (
                <div
                    key={post.id_postingan}
                    className="bg-white p-5 rounded-lg shadow-sm border space-y-4"
                >
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">{post.user_name}</span>
                        <span>{dayjs(post.created_at).format('DD MMM YYYY HH:mm')}</span>
                    </div>
                    <p className="text-gray-800">{post.caption}</p>
                    {post.foto_postingan && (
                        <img
                            src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${post.foto_postingan}`}
                            alt="post"
                            className="w-full rounded-md border"
                        />
                    )}

                    <button
                        onClick={() => handleLike(post.id_postingan)}
                        className="text-sm text-gray-700 hover:underline"
                    >
                        {post.is_liked ? '💔 Unlike' : '❤️ Like'} ({post.likes_count})
                    </button>

                    <div className="pt-2 space-y-1">
                        {post.comments.map((c) => (
                            <div key={c.id_interaksi} className="text-sm text-gray-700">
                                <span className="font-medium">{c.user_name}</span>: {c.isi_komentar}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                        <input
                            type="text"
                            placeholder="Tulis komentar..."
                            value={commentInputs[post.id_postingan] || ''}
                            onChange={(e) =>
                                setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.id_postingan]: e.target.value,
                                }))
                            }
                            className="flex-1 border p-2 rounded-md text-sm focus:outline-none focus:ring focus:ring-gray-400"
                        />
                        <button
                            onClick={() => handleComment(post.id_postingan)}
                            className="bg-orange-500 hover:bg-orange-300 text-white px-4 py-1 rounded-md text-sm"
                        >
                            Kirim
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
