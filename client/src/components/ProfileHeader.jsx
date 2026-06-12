import { FaGithub, FaUsers, FaUserPlus, FaCode, FaMapMarkerAlt, FaBuilding, FaLink, FaCalendarAlt } from 'react-icons/fa';
import { formatDate } from '../utils/format';

const ProfileHeader = ({ profile }) => {
  if (!profile) return null;

  const profileStats = [
    {
      icon: FaGithub,
      label: 'Repositories',
      value: profile.public_repos ?? 0,
      colorClass: 'text-blue-400',
    },
    {
      icon: FaUsers,
      label: 'Followers',
      value: profile.followers ?? 0,
      colorClass: 'text-green-400',
    },
    {
      icon: FaUserPlus,
      label: 'Following',
      value: profile.following ?? 0,
      colorClass: 'text-yellow-400',
    },
    {
      icon: FaCode,
      label: 'Gists',
      value: profile.public_gists ?? 0,
      colorClass: 'text-purple-400',
    },
  ];

  const infoItems = [
    {
      condition: profile.location,
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: profile.location,
      iconClass: 'text-blue-400',
    },
    {
      condition: profile.company,
      icon: FaBuilding,
      label: 'Company',
      value: profile.company,
      iconClass: 'text-green-400',
    },
    {
      condition: profile.blog,
      icon: FaLink,
      label: 'Blog',
      value: profile.blog,
      iconClass: 'text-yellow-400',
      isLink: true,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/60 via-gray-800/30 to-gray-900/60 rounded-2xl shadow-2xl overflow-hidden border border-gray-800/80 backdrop-blur-md">
      <div className="bg-gradient-to-r from-blue-600/5 via-purple-600/10 to-pink-600/5 p-6 border-b border-gray-800/40">
        <div className="flex flex-col md:flex-row items-center md:items-start p-2">
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <img
              src={profile.avatar_url}
              alt={profile.name || profile.login}
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-gray-800/80 shadow-xl"
            />
          </div>

          <div className="flex-1 text-center md:text-left mt-6 md:mt-0 md:ml-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {profile.name || profile.login}
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-3 flex items-center justify-center md:justify-start gap-2">
              <FaGithub className="text-gray-500" /> @{profile.login}
            </p>
            {profile.bio && (
              <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">{profile.bio}</p>
            )}
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <FaGithub className="text-white/80" /> View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 bg-gray-900/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {profileStats.map(({ icon: Icon, label, value, colorClass }) => (
            <div
              key={label}
              className="bg-gray-950/40 p-4 rounded-xl border border-gray-800/60 transition-all duration-300 hover:border-gray-700/60"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`${colorClass} text-sm`} />
                <div className="text-gray-400 text-xs font-semibold">{label}</div>
              </div>
              <div className="text-xl font-bold text-white tracking-tight">{value}</div>
            </div>
          ))}
        </div>

        {/* Additional Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800/40">
          {infoItems.map(({ condition, icon: Icon, label, value, iconClass, isLink }) =>
            condition ? (
              <div
                key={label}
                className="flex items-center gap-3 text-gray-300 p-3 rounded-xl bg-gray-950/20 border border-gray-800/40 hover:bg-gray-950/40 transition-colors"
              >
                <Icon className={`${iconClass} shrink-0 text-base`} />
                <div className={isLink ? 'flex-1 min-w-0' : ''}>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {label}
                  </div>
                  {isLink ? (
                    <a
                      href={value.startsWith('http') ? value : `https://${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline font-semibold text-sm truncate block"
                    >
                      {value}
                    </a>
                  ) : (
                    <div className="font-semibold text-sm truncate">{value}</div>
                  )}
                </div>
              </div>
            ) : null
          )}

          <div className="flex items-center gap-3 text-gray-300 p-3 rounded-xl bg-gray-950/20 border border-gray-800/40 hover:bg-gray-950/40 transition-colors">
            <FaCalendarAlt className="text-purple-400 shrink-0 text-base" />
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Joined</div>
              <div className="font-semibold text-sm">
                {formatDate(profile.created_at, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
