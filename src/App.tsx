import React from 'react';
import { CreatePost } from './components/CreatePost';
import { PostList } from './components/PostList';
import { UserModal } from './components/UserModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BookOpen, PlusCircle, LayoutDashboard } from 'lucide-react';
import { useForumStore } from './store/useForumStore';

function App() {
  const { togglePostModal, currentUser, isAdmin } = useForumStore();
  const [showAdmin, setShowAdmin] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <UserModal />
      <CreatePost />
      
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Zero to One Discussion Forum
                </h1>
                <p className="mt-1 text-gray-600">
                  Share and discuss insights from Peter Thiel's groundbreaking book
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button
                  onClick={() => setShowAdmin(!showAdmin)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  {showAdmin ? 'View Forum' : 'Admin Panel'}
                </button>
              )}
              
              {currentUser && (
                <button
                  onClick={togglePostModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <PlusCircle className="w-5 h-5" />
                  New Post
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {showAdmin ? <AdminDashboard /> : <PostList />}
      </main>
    </div>
  );
}

export default App;