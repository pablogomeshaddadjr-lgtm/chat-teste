import React, { useState } from 'react';
import { X, Users, MessageSquare, Shield, Activity, Plus } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const { users, channels, updateUser, createChannel, config, updateConfig } = useChat();
  const [activeTab, setActiveTab] = useState<'users' | 'channels' | 'settings'>('users');
  const [newChannelName, setNewChannelName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-dark-card border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-3">
            <Shield className="text-brand" size={24} />
            <h2 className="text-xl font-bold text-white">Admin Console</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800/50">
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-gray-400 hover:text-white'}`}>
            <Users size={16} /> Users
          </button>
          <button onClick={() => setActiveTab('channels')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'channels' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-gray-400 hover:text-white'}`}>
            <MessageSquare size={16} /> Channels
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-gray-400 hover:text-white'}`}>
            <Activity size={16} /> System
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-dark-bg">
          
          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800 text-xs uppercase">
                    <th className="py-3">User</th>
                    <th className="py-3">Role</th>
                    <th className="py-3">XP/Lvl</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map(u => (
                    <tr key={u.id} className="group hover:bg-white/[0.02]">
                      <td className="py-3 flex items-center gap-3">
                        <img src={u.avatar} className="w-8 h-8 rounded-full" alt="" />
                        <span className="text-sm font-medium text-white">{u.name}</span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded border ${
                           u.role === 'ADMIN' ? 'border-red-500 text-red-500' :
                           u.role === 'MOD' ? 'border-blue-500 text-blue-500' :
                           u.role === 'VIP' ? 'border-yellow-500 text-yellow-500' :
                           'border-gray-600 text-gray-400'
                        }`}>{u.role}</span>
                      </td>
                      <td className="py-3 text-sm text-gray-400">{u.xp} xp (Lvl {u.level})</td>
                      <td className="py-3 text-right">
                        {u.role !== 'BOT' && (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => updateUser(u.id, { role: u.role === 'VIP' ? 'MEMBER' : 'VIP' })}
                              className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded hover:bg-yellow-500/20"
                            >
                              {u.role === 'VIP' ? 'UnVIP' : 'Make VIP'}
                            </button>
                            <button 
                              onClick={() => updateUser(u.id, { role: 'MOD' })}
                              className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20"
                            >
                              Promote
                            </button>
                            <button 
                               onClick={() => updateUser(u.id, { isMuted: !u.isMuted, muteUntil: !u.isMuted ? Date.now() + 60000 : 0 })}
                               className={`text-xs px-2 py-1 rounded ${u.isMuted ? 'bg-orange-500/10 text-orange-500' : 'bg-gray-700 text-gray-300'}`}
                            >
                              {u.isMuted ? 'Unmute' : 'Mute'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CHANNELS TAB */}
          {activeTab === 'channels' && (
            <div>
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="New channel name (e.g. general)"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand"
                />
                <button 
                  onClick={() => {
                    if (newChannelName) {
                      createChannel(newChannelName);
                      setNewChannelName('');
                    }
                  }}
                  className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={16} /> Create
                </button>
              </div>
              <div className="space-y-2">
                {channels.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">#</span>
                      <span className="text-white font-medium">{c.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded ml-2">{c.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

           {/* SETTINGS TAB */}
           {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                <div>
                  <h4 className="text-white font-medium">Slow Mode</h4>
                  <p className="text-sm text-gray-400">Limit message frequency</p>
                </div>
                <button 
                  onClick={() => updateConfig({ slowMode: !config.slowMode })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.slowMode ? 'bg-brand' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${config.slowMode ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                <div>
                  <h4 className="text-white font-medium">Allow GIFs</h4>
                  <p className="text-sm text-gray-400">Enable Giphy integration</p>
                </div>
                <button 
                  onClick={() => updateConfig({ allowGifs: !config.allowGifs })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.allowGifs ? 'bg-brand' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${config.allowGifs ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                <div>
                  <h4 className="text-white font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-gray-400">Lock chat for non-admins</p>
                </div>
                <button 
                  onClick={() => updateConfig({ maintenanceMode: !config.maintenanceMode })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${config.maintenanceMode ? 'bg-red-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${config.maintenanceMode ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;