export type Role = 'ADMIN' | 'MOD' | 'VIP' | 'MEMBER' | 'BOT';

export type UserStatus = 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';

export interface User {
  id: string;
  name: string;
  avatar: string; // URL or emoji
  role: Role;
  status: UserStatus;
  xp: number;
  level: number;
  joinedAt: Date;
  isMuted?: boolean;
  muteUntil?: number; // timestamp
}

export interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'bot-only';
  description?: string;
}

export interface Message {
  id: string;
  channelId: string;
  userId: string; // Links to User
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'system' | 'command_response';
  isDeleted?: boolean;
}

export interface AppConfig {
  allowGifs: boolean;
  slowMode: boolean; // seconds
  slowModeDuration: number;
  maintenanceMode: boolean;
}