import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { createRoot } from 'react-dom/client';

export type NotificationType = 'success' | 'error';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

function Notification({ message, type, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = type === 'success' ? (
    <CheckCircle className="h-6 w-6 text-green-400" />
  ) : (
    <XCircle className="h-6 w-6 text-red-400" />
  );

  return (
    <div className="notification-slide fixed right-4 top-4 z-50 flex w-96 items-center gap-x-4 rounded-lg bg-white p-4 shadow-lg">
      <style>{`
        .notification-slide {
          animation: slideIn 0.3s ease-out forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      {icon}
      <p className="flex-1 text-sm text-gray-900">{message}</p>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 hover:bg-gray-100"
      >
        <X className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
}

let notificationContainer: HTMLDivElement | null = null;

export function showNotification(message: string, type: NotificationType) {
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    document.body.appendChild(notificationContainer);
  }

  const root = createRoot(notificationContainer);

  const closeNotification = () => {
    root.unmount();
    if (notificationContainer?.parentNode) {
      notificationContainer.parentNode.removeChild(notificationContainer);
    }
    notificationContainer = null;
  };

  root.render(
    <Notification
      message={message}
      type={type}
      onClose={closeNotification}
    />
  );
}
