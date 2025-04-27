import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const AdminNav = () => {
  const { state, dispatch } = useNotifications();
  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* ...existing code... */}
          
          <div className="flex items-center">
            <NotificationDropdown 
              notifications={state.notifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAll}
            />
            {/* ...existing code... */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
