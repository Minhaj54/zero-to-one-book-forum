import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Send, Pencil, Trash2 } from 'lucide-react';
import { useForumStore } from '../store/useForumStore';
import { formatDistanceToNow } from 'date-fns';
import { EditPostModal } from './EditPostModal';

export function PostList() {
  const { 
    posts, 
    currentUser, 
    toggleUpvote, 
    toggleDownvote, 
    addComment,
    deletePost,
    setEditingPost,
    editingPost
  } = useForumStore();
  
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [activeComments, setActiveComments] = useState<Record<string, boolean>>({});

  const handleComment = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content || !currentUser) return;

    addComment(postId, {
      id: Date.now().toString(),
      postId,
      content,
      authorName: currentUser,
      createdAt: new Date(),
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const toggleComments = (postId: string) => {
    setActiveComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}
      
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName}`}
                  alt="avatar"
                  className="w-6 h-6 rounded-full"
                />
                <span>{post.authorName} • {formatDistanceToNow(post.createdAt)} ago</span>
              </div>
            </div>
            
            {(currentUser === post.authorName || currentUser === 'admin') && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-4">{post.content}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="rounded-lg mb-4 max-h-96 object-cover"
            />
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-gray-500">
            <button
              onClick={() => currentUser && toggleUpvote(post.id, currentUser)}
              className={`flex items-center gap-1 ${
                currentUser && post.upvotes.includes(currentUser)
                  ? 'text-blue-500'
                  : 'hover:text-blue-500'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{post.upvotes.length}</span>
            </button>

            <button
              onClick={() => currentUser && toggleDownvote(post.id, currentUser)}
              className={`flex items-center gap-1 ${
                currentUser && post.downvotes.includes(currentUser)
                  ? 'text-red-500'
                  : 'hover:text-red-500'
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span>{post.downvotes.length}</span>
            </button>

            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center gap-1 hover:text-blue-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments.length}</span>
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="flex items-center gap-1 hover:text-blue-500"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>

          {activeComments[post.id] && (
            <div className="mt-4 space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.authorName}`}
                      alt="avatar"
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{comment.authorName} • {formatDistanceToNow(comment.createdAt)} ago</span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <button
                  onClick={() => handleComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim() || !currentUser}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}