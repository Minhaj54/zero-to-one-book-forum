export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          image_url: string | null;
          author_name: string;
          created_at: string;
          tags: string[];
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          image_url?: string | null;
          author_name: string;
          created_at?: string;
          tags?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          image_url?: string | null;
          author_name?: string;
          created_at?: string;
          tags?: string[];
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          content: string;
          author_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          content: string;
          author_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          content?: string;
          author_name?: string;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          post_id: string;
          user_name: string;
          vote_type: 'up' | 'down';
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_name: string;
          vote_type: 'up' | 'down';
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_name?: string;
          vote_type?: 'up' | 'down';
          created_at?: string;
        };
      };
    };
  };
}