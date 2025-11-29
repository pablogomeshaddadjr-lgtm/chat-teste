import React, { useState, useEffect, useRef } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import AdminPanel from './components/AdminPanel';
import UserProfile from './components/UserProfile';
import { Menu, Send, Smile, Paperclip } from 'lucide-react';
import { User } from './types';

const ChatApp = () => {
  const { 
    currentUser, 
    login, 
    messages, 
    activeChannelId, 
    channels, 
    sendMessage, 
    users 
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannelId]);

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        <div className="relative glass-panel p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-[0_0_25px_rgba(142,92,255,0.6)] animate-bounce-slight">
               <span className="text-3xl font-bold text-white">P</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">PromptClub</h2>
          <p className="text-gray-400 text-center mb-8">Enter the premium chat experience.</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const val = (e.target as any).username.value;
            if(val) login(val);
          }}>
            <input 
              name="username"
              type="text" 
              placeholder="Choose your handle..." 
              className="w-full bg-gray-900/50 border border-gray-600 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand mb-4 transition-all"
              autoFocus
            />
            <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-brand/20">
              Join Chat
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">Try 'Admin' in name for admin rights.</p>
          </form>
        </div>
      </div>
    );
  }

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const currentMessages = messages.filter(m => m.channelId === activeChannelId);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-bg">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onOpenProfile={() => setProfileUser(currentUser)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:ml-64 relative transition-all duration-300">
        
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-800 bg-dark-surface/95 backdrop-blur z-20">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-gray-400 hover:text-white">
              <Menu />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-light text-lg">#</span>
                <span className="text-white font-bold text-lg tracking-wide">{activeChannel?.name}</span>
              </div>
              <span className="text-xs text-gray-500 hidden md:block">{activeChannel?.description}</span>
            </div>
          </div>
          <div className="flex -space-x-2">
             {users.slice(0, 5).map(u => (
               <img key={u.id} src={u.avatar} className="w-8 h-8 rounded-full border-2 border-dark-surface cursor-pointer" title={u.name} onClick={() => setProfileUser(u)} />
             ))}
             {users.length > 5 && (
               <div className="w-8 h-8 rounded-full border-2 border-dark-surface bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                 +{users.length - 5}
               </div>
             )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2">
          {currentMessages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">👋</span>
                </div>
                <p className="text-xl font-light">Welcome to #{activeChannel?.name}</p>
                <p className="text-sm">Start the conversation!</p>
             </div>
          ) : (
             currentMessages.map(msg => {
                const author = users.find(u => u.id === msg.userId);
                if (!author) return null;
                return (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    author={author} 
                    isOwn={author.id === currentUser.id} 
                  />
                );
             })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-dark-bg">
          <div className="relative flex items-center gap-2 bg-gray-800/50 p-2 rounded-2xl border border-gray-700 shadow-lg focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/50 transition-all">
            <button className="p-2 text-gray-400 hover:text-brand transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                   e.preventDefault();
                   if (inputText.trim()) {
                     sendMessage(inputText);
                     setInputText('');
                   }
                }
              }}
              placeholder={`Message #${activeChannel?.name}`}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none px-2 py-1"
            />
            <button className="p-2 text-gray-400 hover:text-brand transition-colors hidden md:block">
              <Smile size={20} />
            </button>
            <button 
              onClick={() => {
                if (inputText.trim()) {
                  sendMessage(inputText);
                  setInputText('');
                  inputRef.current?.focus();
                }
              }}
              className={`p-2 rounded-xl transition-all ${inputText.trim() ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
              disabled={!inputText.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
             <span className="text-[10px] text-gray-600">
               Type <strong>/help</strong> for commands. AI powered by Gemini.
             </span>
          </div>
        </div>
      </div>
      
      {/* Overlays */}
      <AdminPanel isOpen={showAdmin} onClose={() => setShowAdmin(false)} />
      {profileUser && (
        <UserProfile 
          user={profileUser} 
          isCurrentUser={profileUser.id === currentUser.id} 
          onClose={() => setProfileUser(null)} 
        />
      )}
    </div>
  );
};

const App = () => (
  <ChatProvider>
    <ChatApp />
  </ChatProvider>
);

export default App;