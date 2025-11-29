import React from 'react';
import { User, Message } from '../types';
import { Trash2, ShieldAlert } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface Props {
  message: Message;
  author: User;
  isOwn: boolean;
}

const MessageBubble: React.FC<Props> = ({ message, author, isOwn }) => {
  const { currentUser, deleteMessage } = useChat();

  const canModerate = currentUser?.role === 'ADMIN' || currentUser?.role === 'MOD';

  if (message.isDeleted) {
    return (
      <div className="flex gap-4 py-2 opacity-50 italic text-gray-600 text-sm pl-16">
        <ShieldAlert size={16} /> Message removed by moderator.
      </div>
    );
  }

  // Role Badge
  const getRoleBadge = () => {
    switch (author.role) {
      case 'ADMIN': return <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">ADM</span>;
      case 'MOD': return <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">MOD</span>;
      case 'VIP': return <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">VIP</span>;
      case 'BOT': return <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand/20 text-brand border border-brand/30">BOT</span>;
      default: return null;
    }
  };

  const nameColor = author.role === 'ADMIN' ? 'text-red-400' : author.role === 'MOD' ? 'text-blue-400' : author.role === 'BOT' ? 'text-brand' : 'text-gray-300';

  return (
    <div className={`group flex gap-4 py-3 px-4 hover:bg-white/[0.02] transition-colors animate-fade-in ${isOwn ? '' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <img 
          src={author.avatar} 
          alt={author.name} 
          className={`w-10 h-10 rounded-full border-2 ${author.role === 'BOT' ? 'border-brand' : 'border-gray-700'}`} 
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center mb-1">
            <span className={`font-semibold text-sm ${nameColor}`}>{author.name}</span>
            {getRoleBadge()}
            <span className="ml-2 text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          {/* Actions */}
          {(canModerate || isOwn) && (
            <button 
              onClick={() => deleteMessage(message.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        
        <div className={`text-sm md:text-base leading-relaxed text-gray-200 whitespace-pre-wrap break-words ${author.role === 'BOT' ? 'font-mono text-brand-light' : ''}`}>
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;