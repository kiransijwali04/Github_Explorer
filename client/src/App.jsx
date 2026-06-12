
import { useState, lazy, Suspense } from 'react';
import NavButton from './components/NavButton';
import { FaGithub } from 'react-icons/fa';
import { ProfileSkeleton } from './components/SkeletonLoader';

const ProfileViewer = lazy(() => import('./components/ProfileViewer'));
const RepoExplorer = lazy(() => import('./components/RepoExplorer'));

function App() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-project-gradient">
      <nav className="bg-black/15 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <FaGithub className="text-2xl text-blue-500 hover:text-white transition-colors duration-300" />
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight select-none">
                GitHub <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Explorer</span>
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <NavButton onClick={() => setActiveTab('profile')} isActive={activeTab === 'profile'}>
                Profile Viewer
              </NavButton>
              <NavButton onClick={() => setActiveTab('repos')} isActive={activeTab === 'repos'}>
                Repo Explorer
              </NavButton>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-auto bg-transparent">
        <Suspense fallback={
          <div className="max-w-4xl mx-auto py-8 px-4 w-full h-full flex items-center justify-center">
            <ProfileSkeleton />
          </div>
        }>
          {activeTab === 'profile' ? <ProfileViewer /> : <RepoExplorer />}
        </Suspense>
      </main>
    </div>
  );
}

export default App;


