import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Bell, Palette, X, Save, Lock, Mail, Smartphone } from 'lucide-react';

interface ProfileSettingsProps {
  user: any;
  onClose: () => void;
  onUpdate: (updatedUser: any) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    email: user.email || 'tony@stark.com',
    phone: user.phone || '+1 (555) 000-0000',
    bio: user.bio || 'Genius, Billionaire, Playboy, Philanthropist.',
    theme: 'default',
    notifications: true
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload: any = {
        id: user.id,
        ...formData
      };

      if (passwordData.new) {
        if (passwordData.new !== passwordData.confirm) {
          setError("New passwords don't match");
          setLoading(false);
          return;
        }
        if (!passwordData.current) {
          setError("Current password required");
          setLoading(false);
          return;
        }
        payload.password = passwordData.current;
        payload.newPassword = passwordData.new;
      }

      const res = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        onUpdate(data.user);
        setSuccess('Profile updated successfully');
        if (passwordData.new) {
          setPasswordData({ current: '', new: '', confirm: '' });
        }
        setTimeout(onClose, 1500);
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError('System error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl h-[600px] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden"
      >
        {/* Sidebar */}
        <div className="w-64 bg-white/[0.02] border-r border-white/5 p-6 flex flex-col">
          <h2 className="text-xl font-bold tracking-tight mb-8 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-blue-500" />
            Settings
          </h2>
          <div className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-white">{user.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{user.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-white/5 flex items-center justify-between px-8">
            <h3 className="text-lg font-medium text-white">{tabs.find(t => t.id === activeTab)?.label}</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-xl">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group relative overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-zinc-600 group-hover:text-blue-500" />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] uppercase font-bold text-white">Change</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Profile Photo</h4>
                    <p className="text-xs text-zinc-500">Recommended 400x400px. JPG or PNG.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400">Username</label>
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Bio</label>
                  <textarea 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <h4 className="text-sm font-medium text-white mb-4">Security</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-400">Current Password</label>
                      <input 
                        type="password" 
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                        placeholder="Required to change password"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400">New Password</label>
                        <input 
                          type="password" 
                          value={passwordData.new}
                          onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-400">Confirm New Password</label>
                        <input 
                          type="password" 
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 max-w-xl">
                <div className="grid grid-cols-3 gap-4">
                  {['Default', 'Cyberpunk', 'Minimal'].map((theme) => (
                    <div 
                      key={theme}
                      onClick={() => setFormData({...formData, theme: theme.toLowerCase()})}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        formData.theme === theme.toLowerCase() 
                          ? 'border-blue-500 bg-blue-500/5' 
                          : 'border-white/10 hover:border-white/20 bg-black/50'
                      }`}
                    >
                      <div className="aspect-video rounded-lg bg-gradient-to-br from-zinc-800 to-black mb-3" />
                      <div className="text-sm font-medium text-white text-center">{theme}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-20 border-t border-white/5 flex items-center justify-between px-8 gap-4 bg-black/20">
            <div className="flex-1">
              {error && <span className="text-xs text-red-400">{error}</span>}
              {success && <span className="text-xs text-green-400">{success}</span>}
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
