import React, { useState } from 'react';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { signOutUser } from '../../services/authService';

export default function Header() {
  const { state, dispatch } = useAppContext();
  const { user, notifications } = state;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await signOutUser();
      dispatch({ type: 'SET_USER', payload: null });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 truncate">
            Sistem Manajemen Roastery
          </h2>
          <p className="text-sm text-gray-600 hidden sm:block">
            Selamat datang, {user?.name}
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">Tidak ada notifikasi</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markNotificationRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.timestamp.toLocaleString('id-ID')}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-800 truncate max-w-32">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}