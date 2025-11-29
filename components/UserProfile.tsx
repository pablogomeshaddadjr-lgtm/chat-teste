import React from 'react';
import { User } from '../types';
import { X, Trophy, Disc, Calendar } from 'lucide-react';

interface Props {
  user: User;
  onClose: () => void;
  isCurrentUser: boolean;
}

const UserProfile: React.FC<Props> = ({ user, onClose, isCurrentUser }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-dark-card border border-brand/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-brand-dark to-brand"></div>
        
        {/* Avatar */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full border-4 border-dark-card overflow-hidden bg-black">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {/* Status Dot */}
            <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-dark-card 
                ${user.status === 'ONLINE' ? 'bg-green-500' : 
                  user.status === 'BUSY' ? 'bg-red-500' : 'bg-gray-500'}`} 
            />
        </div>

        <button onClick={onClose} className="absolute top-2 right-2 p-2 bg-black/20 rounded-full hover:bg-black/40 text-white">
            <X size={20} />
        </button>

        <div className="pt-16 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <div className="flex justify-center gap-2 mb-4">
                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider
                    ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                      user.role === 'VIP' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                    {user.role}
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                    <div className="flex justify-center text-brand mb-1"><Trophy size={16} /></div>
                    <div className="text-lg font-bold text-white">{user.level}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Level</div>
                </div>
                <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                    <div className="flex justify-center text-yellow-500 mb-1"><Disc size={16} /></div>
                    <div className="text-lg font-bold text-white">{user.xp}</div>
                    <div className="text-[10px] text-gray-500 uppercase">XP</div>
                </div>
                <div className="bg-gray-800/50 p-2 rounded-lg border border-gray-700">
                    <div className="flex justify-center text-blue-400 mb-1"><Calendar size={16} /></div>
                    <div className="text-lg font-bold text-white">
                        {Math.floor((Date.now() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase">Days</div>
                </div>
            </div>

            {/* XP Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
                <div 
                    className="bg-brand h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(user.xp % 100)}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-6">
                <span>Current Level</span>
                <span>Next Level</span>
            </div>

            {isCurrentUser && (
                <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
                    Edit Profile
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;