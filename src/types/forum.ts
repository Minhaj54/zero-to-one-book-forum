export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  createdAt: Date;
  tags: string[];
  upvotes: string[];
  downvotes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  createdAt: Date;
}

export interface ForumState {
  isPostModalOpen: boolean;
  currentUser: string | null;
  isAdmin: boolean;
  editingPost: Post | null;
}

export interface EditPostModalProps {
  post: Post;
  onClose: () => void;
}