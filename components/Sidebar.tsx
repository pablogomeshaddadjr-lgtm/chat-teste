import React from 'react';
import { Hash, Radio, Lock, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenProfile, onOpenAdmin }) => {
  const { channels, activeChannelId, setActiveChannelId, currentUser, logout } = useChat();

  const getChannelIcon = (type: string) => {
    if (type === 'bot-only') return <Radio size={18} className="text-brand" />;
    if (type === 'private') return <Lock size={18} className="text-yellow-500" />;
    return <Hash size={18} className="text-gray-400" />;
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-dark-surface border-r border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(142,92,255,0.4)]">
          <span className="font-bold text-white">P</span>
        </div>
        <h1 className="font-bold text-xl tracking-tight">PromptClub</h1>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Channels</h3>
        {channels.map(channel => (
          <button
            key={channel.id}
            onClick={() => {
              setActiveChannelId(channel.id);
              if (window.innerWidth < 768) onClose();
            }}
            className={`w-full flex items-center px-3 py-2 rounded-md transition-colors group ${
              activeChannelId === channel.id 
                ? 'bg-gray-800 text-brand-light' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`}
          >
            <span className="mr-3">{getChannelIcon(channel.type)}</span>
            <span className="font-medium truncate">{channel.name}</span>
          </button>
        ))}
      </div>

      {/* Footer User Area */}
      {currentUser && (
        <div className="p-4 bg-black/20 border-t border-gray-800">
          <div className="flex items-center mb-3">
            <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-700" />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500">Lvl {currentUser.level} • {currentUser.role}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={onOpenProfile} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors" title="Profile">
              <UserIcon size={18} />
            </button>
            {currentUser.role === 'ADMIN' && (
              <button onClick={onOpenAdmin} className="p-2 text-gray-400 hover:text-brand-light hover:bg-gray-800 rounded-lg transition-colors" title="Admin Panel">
                <Settings size={18} />
              </button>
            )}
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;