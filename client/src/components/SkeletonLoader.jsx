

export const ProfileSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/60 p-6 shadow-2xl animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col md:flex-row items-center md:items-start p-6 border-b border-gray-800/40 gap-6">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-800" />
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div className="h-8 bg-gray-800 rounded-lg w-1/2 mx-auto md:mx-0" />
          <div className="h-4 bg-gray-800 rounded-lg w-1/4 mx-auto md:mx-0" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded-lg w-full" />
            <div className="h-4 bg-gray-800 rounded-lg w-5/6" />
          </div>
          <div className="h-10 bg-gray-800 rounded-lg w-36 mx-auto md:mx-0" />
        </div>
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-850/40 p-4 rounded-xl border border-gray-800/40 space-y-2 bg-gray-900/30">
              <div className="h-4 bg-gray-850 rounded w-2/3 bg-gray-800" />
              <div className="h-6 bg-gray-850 rounded w-1/2 bg-gray-850 bg-gray-800" />
            </div>
          ))}
        </div>

        {/* Bio Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800/40">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-900/30 rounded-lg border border-gray-800/40" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const RepoListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse w-full max-w-7xl mx-auto">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="h-5 bg-gray-800 rounded w-3/4" />
            <div className="h-5 bg-gray-800 rounded w-12" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-800 rounded w-5/6" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-gray-800 rounded w-1/3" />
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-800 rounded w-12" />
              <div className="h-4 bg-gray-800 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
