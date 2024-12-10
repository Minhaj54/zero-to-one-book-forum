import React from 'react';
import { useForumStore } from '../store/useForumStore';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

export function AdminDashboard() {
  const { posts, deletePost, setEditingPost, currentUser, isAdmin } = useForumStore();

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{post.title}</span>
                      <span className="text-sm text-gray-500">
                        {post.content.slice(0, 100)}...
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`}
                        alt="avatar"
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      {post.authorName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDistanceToNow(post.createdAt)} ago
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {post.upvotes.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsDown className="w-4 h-4" />
                        {post.downvotes.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}