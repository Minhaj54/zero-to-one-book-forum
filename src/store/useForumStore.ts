import { create } from 'zustand';
import { Post, Comment, ForumState } from '../types/forum';
import { supabase } from '../lib/supabase';

interface ForumStore extends ForumState {
  posts: Post[];
  setCurrentUser: (username: string) => void;
  togglePostModal: () => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => Promise<void>;
  updatePost: (updatedPost: Post) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  toggleUpvote: (postId: string, username: string) => Promise<void>;
  toggleDownvote: (postId: string, username: string) => Promise<void>;
  setEditingPost: (post: Post | null) => void;
  fetchPosts: () => Promise<void>;
}

export const useForumStore = create<ForumStore>((set, get) => ({
  posts: [],
  isPostModalOpen: false,
  currentUser: null,
  isAdmin: false,
  editingPost: null,
  
  setCurrentUser: (username) => set({ 
    currentUser: username,
    isAdmin: username.toLowerCase() === 'admin'
  }),
  
  togglePostModal: () => set((state) => ({ 
    isPostModalOpen: !state.isPostModalOpen,
    editingPost: null
  })),
  
  setEditingPost: (post) => set({ editingPost: post }),
  
  fetchPosts: async () => {
    const { data: posts } = await supabase
      .from('posts')
      .select(`
        *,
        comments (*),
        votes (*)
      `)
      .order('created_at', { ascending: false });

    if (posts) {
      const formattedPosts = posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.image_url,
        authorName: post.author_name,
        createdAt: new Date(post.created_at),
        tags: post.tags,
        comments: post.comments.map((comment: any) => ({
          id: comment.id,
          postId: comment.post_id,
          content: comment.content,
          authorName: comment.author_name,
          createdAt: new Date(comment.created_at),
        })),
        upvotes: post.votes.filter((v: any) => v.vote_type === 'up').map((v: any) => v.user_name),
        downvotes: post.votes.filter((v: any) => v.vote_type === 'down').map((v: any) => v.user_name),
      }));

      set({ posts: formattedPosts });
    }
  },
  
  addPost: async (post) => {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: post.title,
        content: post.content,
        image_url: post.imageUrl,
        author_name: post.authorName,
        tags: post.tags,
      })
      .select()
      .single();

    if (data) {
      get().fetchPosts();
    }
  },
    
  updatePost: async (updatedPost) => {
    const { error } = await supabase
      .from('posts')
      .update({
        title: updatedPost.title,
        content: updatedPost.content,
        image_url: updatedPost.imageUrl,
        tags: updatedPost.tags,
      })
      .eq('id', updatedPost.id);

    if (!error) {
      get().fetchPosts();
    }
  },
    
  deletePost: async (postId) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (!error) {
      get().fetchPosts();
    }
  },
    
  addComment: async (postId, comment) => {
    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content: comment.content,
        author_name: comment.authorName,
      });

    if (!error) {
      get().fetchPosts();
    }
  },
    
  toggleUpvote: async (postId, username) => {
    const { data: existingVote } = await supabase
      .from('votes')
      .select()
      .eq('post_id', postId)
      .eq('user_name', username)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === 'up') {
        await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);
      } else {
        await supabase
          .from('votes')
          .update({ vote_type: 'up' })
          .eq('id', existingVote.id);
      }
    } else {
      await supabase
        .from('votes')
        .insert({
          post_id: postId,
          user_name: username,
          vote_type: 'up',
        });
    }

    get().fetchPosts();
  },
    
  toggleDownvote: async (postId, username) => {
    const { data: existingVote } = await supabase
      .from('votes')
      .select()
      .eq('post_id', postId)
      .eq('user_name', username)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === 'down') {
        await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);
      } else {
        await supabase
          .from('votes')
          .update({ vote_type: 'down' })
          .eq('id', existingVote.id);
      }
    } else {
      await supabase
        .from('votes')
        .insert({
          post_id: postId,
          user_name: username,
          vote_type: 'down',
        });
    }

    get().fetchPosts();
  },
}));