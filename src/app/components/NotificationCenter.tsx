import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  BellRing, 
  X, 
  Check, 
  Trash2, 
  Filter, 
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Archive
} from 'lucide-react';
import { useGreenhouse } from '../context/GreenhouseContext';
import { useTheme } from '../context/ThemeContext';

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: Date;
  acknowledged: boolean;
  read: boolean;
}

export function NotificationCenter() {
  const { alerts, acknowledgeAlert, dismissAlert } = useGreenhouse();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Convert alerts to notifications
  useEffect(() => {
    const converted: NotificationItem[] = alerts.map(alert => ({
      ...alert,
      read: alert.acknowledged,
    }));
    setNotifications(converted);
  }, [alerts]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.severity === filter;
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.severity === 'critical' && !n.read).length;

  const handleAcknowledge = (id: string) => {
    acknowledgeAlert(id);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true, acknowledged: true } : n)
    );
  };

  const handleDismiss = (id: string) => {
    dismissAlert(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    unreadIds.forEach(id => {
      acknowledgeAlert(id);
    });
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true, acknowledged: true }))
    );
  };

  const handleClearAll = () => {
    notifications.forEach(notification => {
      dismissAlert(notification.id);
    });
    setNotifications([]);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle size={16} style={{ color: '#ef4444' }} />;
      case 'warning':
        return <AlertTriangle size={16} style={{ color: '#f59e0b' }} />;
      case 'info':
        return <Info size={16} style={{ color: '#3b82f6' }} />;
      default:
        return <Bell size={16} style={{ color: '#6b7280' }} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return theme === 'dark' ? '#ef4444' : '#d4183d';
      case 'warning':
        return theme === 'dark' ? '#f59e0b' : '#f97316';
      case 'info':
        return theme === 'dark' ? '#3b82f6' : '#2563eb';
      default:
        return theme === 'dark' ? '#6b7280' : '#4b5563';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl transition-all"
        style={{
          background: isOpen 
            ? theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)'
            : 'transparent',
        }}
      >
        <Bell 
          size={20} 
          style={{ 
            color: theme === 'dark' ? '#89CC41' : '#28951B' 
          }} 
        />
        
        {/* Notification Badge */}
        {(unreadCount > 0 || criticalCount > 0) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              criticalCount > 0 ? 'bg-red-500' : 'bg-green-500'
            } text-white`}
          >
            {criticalCount > 0 ? criticalCount : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-96 max-h-96 bg-white rounded-xl shadow-2xl z-50 border border-[#E6F786] overflow-hidden"
            style={{
              background: theme === 'dark' ? '#2d4a1e' : '#ffffff',
              borderColor: theme === 'dark' ? 'rgba(137, 204, 65, 0.3)' : 'rgba(137, 204, 65, 0.18)',
            }}
          >
            {/* Header */}
            <div 
              className="px-4 py-3 border-b flex items-center justify-between"
              style={{
                borderColor: theme === 'dark' ? 'rgba(137, 204, 65, 0.2)' : 'rgba(137, 204, 65, 0.1)',
              }}
            >
              <div className="flex items-center gap-2">
                <BellRing 
                  size={18} 
                  style={{ 
                    color: theme === 'dark' ? '#89CC41' : '#28951B' 
                  }} 
                />
                <h3 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                  }}
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: theme === 'dark' ? 'rgba(137, 204, 65, 0.2)' : 'rgba(40, 149, 27, 0.1)',
                      color: theme === 'dark' ? '#89CC41' : '#28951B',
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={16} style={{ color: theme === 'dark' ? '#8aab6a' : '#6b8a55' }} />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-3 space-y-2">
              {/* Search */}
              <div className="relative">
                <Search 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: theme === 'dark' ? '#8aab6a' : '#6b8a55' }}
                />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg text-sm"
                  style={{
                    background: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(137, 204, 65, 0.2)' : 'rgba(137, 204, 65, 0.1)'}`,
                    color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'info', label: 'Info' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value as any)}
                    className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: filter === value 
                        ? theme === 'dark' ? 'rgba(137, 204, 65, 0.2)' : 'rgba(40, 149, 27, 0.1)'
                        : 'transparent',
                      color: filter === value 
                        ? theme === 'dark' ? '#89CC41' : '#28951B'
                        : theme === 'dark' ? '#8aab6a' : '#6b8a55',
                      border: filter === value 
                        ? `1px solid ${theme === 'dark' ? 'rgba(137, 204, 65, 0.3)' : 'rgba(40, 149, 27, 0.2)'}`
                        : '1px solid transparent',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{
                      background: theme === 'dark' ? 'rgba(137, 204, 65, 0.1)' : 'rgba(40, 149, 27, 0.05)',
                    }}
                  >
                    <Bell size={24} style={{ color: theme === 'dark' ? '#89CC41' : '#28951B' }} />
                  </div>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.9rem',
                      color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
                    }}
                  >
                    No notifications found
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-3 border-b transition-all cursor-pointer ${
                        !notification.read ? 'font-semibold' : ''
                      }`}
                      style={{
                        background: !notification.read 
                          ? theme === 'dark' ? 'rgba(137, 204, 65, 0.05)' : 'rgba(40, 149, 27, 0.02)'
                          : 'transparent',
                        borderColor: theme === 'dark' ? 'rgba(137, 204, 65, 0.1)' : 'rgba(137, 204, 65, 0.05)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getSeverityIcon(notification.severity)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span 
                              className="text-xs font-medium truncate"
                              style={{ 
                                color: getSeverityColor(notification.severity),
                                fontFamily: 'Poppins, sans-serif',
                              }}
                            >
                              {notification.type}
                            </span>
                            <span 
                              className="text-xs flex items-center gap-1"
                              style={{ 
                                color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
                                fontFamily: 'Poppins, sans-serif',
                              }}
                            >
                              <Clock size={10} />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          
                          <p 
                            className="text-sm line-clamp-2 mb-2"
                            style={{ 
                              color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                              fontFamily: 'Poppins, sans-serif',
                            }}
                          >
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcknowledge(notification.id);
                                }}
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                                style={{
                                  background: theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)',
                                  color: theme === 'dark' ? '#89CC41' : '#28951B',
                                  fontFamily: 'Poppins, sans-serif',
                                }}
                              >
                                <Check size={10} />
                                Mark as read
                              </button>
                            )}
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDismiss(notification.id);
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                              style={{
                                background: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                                color: theme === 'dark' ? '#ef4444' : '#d4183d',
                                fontFamily: 'Poppins, sans-serif',
                              }}
                            >
                              <Trash2 size={10} />
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {notifications.length > 0 && (
              <div 
                className="px-3 py-2 border-t flex items-center justify-between"
                style={{
                  borderColor: theme === 'dark' ? 'rgba(137, 204, 65, 0.2)' : 'rgba(137, 204, 65, 0.1)',
                }}
              >
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                  style={{
                    background: theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)',
                    color: theme === 'dark' ? '#89CC41' : '#28951B',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  <CheckCircle size={12} />
                  Mark all as read
                </button>
                
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                  style={{
                    background: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                    color: theme === 'dark' ? '#ef4444' : '#d4183d',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  <Archive size={12} />
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
