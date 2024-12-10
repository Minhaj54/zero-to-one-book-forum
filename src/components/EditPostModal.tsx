import React, { useState, useEffect } from 'react';
import { ImagePlus, Send, X } from 'lucide-react';
import { useForumStore } from '../store/useForumStore';
import { Post } from '../types/forum';

const CHAR_LIMIT = 1000;
const AVAILABLE_TAGS = ['Technology', 'Entrepreneurship', 'StartupLessons', 'Innovation'];

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
}

export function EditPostModal({ post, onClose }: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [selectedTags, setSelectedTags] = useState<string[]>(post.tags);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '');
  
  const { updatePost } = useForumStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    updatePost({
      ...post,
      title,
      content,
      imageUrl,
      tags: selectedTags,
    });

    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setImageUrl(fakeUrl);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          <div className="mb-4">
            <textarea
              placeholder="Share your insights about Zero to One..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
              maxLength={CHAR_LIMIT}
            />
            <div className="text-sm text-gray-500 mt-1">
              {content.length}/{CHAR_LIMIT} characters
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <ImagePlus className="w-6 h-6 text-gray-500" />
              <span className="text-gray-500">Change Image</span>
            </label>

            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Update
            </button>
          </div>

          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-48 rounded-lg object-cover"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}