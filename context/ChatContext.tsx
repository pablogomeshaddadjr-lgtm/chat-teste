import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Message, Channel, Role, AppConfig } from '../types';
import { handleCommand } from '../services/botLogic';
import { generateBotResponse } from '../services/geminiService';

// --- MOCK DATA ---
const MOCK_CHANNELS: Channel[] = [
  { id: '1', name: 'geral', type: 'public', description: 'General chatter' },
  { id: '2', name: 'marketing', type: 'public', description: 'Growth hacks' },
  { id: '3', name: 'ajuda', type: 'public', description: 'Support & Help' },
  { id: '4', name: 'off-topic', type: 'public', description: 'Memes & Random' },
  { id: '5', name: 'divulgação', type: 'public', description: 'Promote your stuff' },
  { id: '6', name: 'bots', type: 'bot-only', description: 'Bot commands only' },
];

const BOT_USER: User = {
  id: 'bot-001', name: 'PromptBot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=promptbot', role: 'BOT', status: 'ONLINE', xp: 99999, level: 99, joinedAt: new Date()
};

const INITIAL_USERS: User[] = [
  BOT_USER,
  { id: 'admin-1', name: 'AdminAlice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', role: 'ADMIN', status: 'ONLINE', xp: 1200, level: 12, joinedAt: new Date() },
  { id: 'mod-1', name: 'ModMike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', role: 'MOD', status: 'BUSY', xp: 500, level: 5, joinedAt: new Date() },
  { id: 'vip-1', name: 'VipVictor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victor', role: 'VIP', status: 'ONLINE', xp: 800, level: 8, joinedAt: new Date() },
  { id: 'u-1', name: 'UserDave', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave', role: 'MEMBER', status: 'OFFLINE', xp: 50, level: 1, joinedAt: new Date() },
];

// --- CONTEXT ---

interface ChatContextType {
  currentUser: User | null;
  users: User[];
  channels: Channel[];
  messages: Message[];
  activeChannelId: string;
  config: AppConfig;
  login: (name: string) => void;
  logout: () => void;
  sendMessage: (content: string) => void;
  setActiveChannelId: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteMessage: (id: string) => void;
  updateConfig: (updates: Partial<AppConfig>) => void;
  createChannel: (name: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Fix: Make children optional to resolve "Property 'children' is missing" TS error in App.tsx
export const ChatProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('1');
  const [config, setConfig] = useState<AppConfig>({
    allowGifs: true,
    slowMode: false,
    slowModeDuration: 3,
    maintenanceMode: false
  });

  // Login Simulation
  const login = (name: string) => {
    // Check if "User" already exists in simulated session, else create
    const existing = users.find(u => u.name === name && u.role !== 'BOT');
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: name.toLowerCase().includes('admin') ? 'ADMIN' : 'MEMBER', // Backdoor for demo
        status: 'ONLINE',
        xp: 0,
        level: 1,
        joinedAt: new Date()
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  };

  const logout = () => setCurrentUser(null);

  // XP System
  const addXp = (userId: string, amount: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const newXp = u.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      // Level Up notification (local logic only for simplicity)
      if (newLevel > u.level) {
        // We could push a system message here if we wanted
      }
      return { ...u, xp: newXp, level: newLevel };
    }));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const createChannel = (name: string) => {
    const newChannel: Channel = {
      id: `c-${Date.now()}`,
      name: name.toLowerCase().replace(/\s+/g, '-'),
      type: 'public'
    };
    setChannels(prev => [...prev, newChannel]);
  };

  // Bot Typing Simulation
  const simulateBotResponse = async (text: string) => {
    // "Typing" delay
    setTimeout(() => {
      const botMsg: Message = {
        id: `msg-${Date.now()}`,
        channelId: activeChannelId,
        userId: BOT_USER.id,
        content: text,
        timestamp: Date.now(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMsg]);
    }, 800 + Math.random() * 1000);
  };

  const sendMessage = async (content: string) => {
    if (!currentUser) return;

    if (currentUser.isMuted && (currentUser.muteUntil || 0) > Date.now()) {
        alert("You are muted.");
        return;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      userId: currentUser.id,
      content,
      timestamp: Date.now(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Add XP for chatting
    addXp(currentUser.id, 5);

    // Bot Command Check
    if (content.startsWith('/')) {
      const [cmd, ...args] = content.slice(1).split(' ');
      const response = await handleCommand(cmd, args, currentUser, users, addXp);
      simulateBotResponse(response);
    } 
    // AI Mention Check (or context awareness)
    else if (content.includes('@PromptBot') || activeChannelId === '6') {
      const aiResponse = await generateBotResponse(content.replace('@PromptBot', ''));
      simulateBotResponse(aiResponse);
    }
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isDeleted: true } : m));
  };

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <ChatContext.Provider value={{
      currentUser, users, channels, messages, activeChannelId, config,
      login, logout, sendMessage, setActiveChannelId, updateUser, deleteMessage, updateConfig, createChannel
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};