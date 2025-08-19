"use client";
import { markNotificationAsRead, clearReadNotifications } from "../lib/notification";

interface NotificationType {
    id: number;
    type: string;
    data: any;
    read: boolean;
    created_at: string;
}

export default function NotificationsDropdown({
    notifications = [],
    setNotifications,
}: {
    notifications: NotificationType[];
    setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
}) {
    const handleMarkAsRead = async (id: number) => {
        await markNotificationAsRead(id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const handleClearRead = async () => {
        await clearReadNotifications();
        setNotifications(prev => prev.filter(n => !n.read));
    };

    return (
        <div className="p-4 w-80 bg-white shadow rounded">
            <h3 className="font-bold mb-2">Notifications</h3>
            <ul>
                {notifications.length === 0 && (
                    <li className="p-2 text-gray-500">No notifications</li>
                )}
                {notifications.map(n => {
                    let message = "";

                    if (n.type === "interview_scheduled") {
                        message = `Your interview for ${n.data.job_title} (Round ${n.data.round_number}) is scheduled at ${new Date(n.data.scheduled_at).toLocaleString()} with ${n.data.interviewer_name}.`;
                    } else if (n.type === "interview_update") {
                        switch (n.data.status) {
                            case "passed":
                                message = `Congrats! You passed Round ${n.data.round_number} for ${n.data.job_title}.`;
                                break;
                            case "failed":
                                message = `We’re sorry. You failed Round ${n.data.round_number} for ${n.data.job_title}.`;
                                break;
                            case "completed":
                                message = `Your interview for ${n.data.job_title} (Round ${n.data.round_number}) was completed.`;
                                break;
                            case "scheduled":
                                message = `Your interview for ${n.data.job_title} (Round ${n.data.round_number}) is scheduled at ${new Date(n.data.scheduled_at).toLocaleString()} with ${n.data.interviewer_name}.`;
                                break;
                            default:
                                message = `Interview update for ${n.data.job_title} (Round ${n.data.round_number}).`;
                        }
                    } else if (n.type === "application_status_update") {
                        switch (n.data.status) {
                            case 'pending':
                                message = `Your application for ${n.data.job_title} has been received.`;
                                break;
                            case 'shortlisted':
                                message = `Your application for ${n.data.job_title} has been shortlisted.`;
                                break;
                            case 'in_interview':
                                message = `Your application for ${n.data.job_title} is in the interview stage.`;
                                break;
                            case 'selected':
                                message = `Congratulations! Your application for ${n.data.job_title} has been selected.`;
                                break;
                            case 'rejected':
                                message = `Your application for ${n.data.job_title} has been rejected.`;
                                break;
                        }
                    } else {
                        message = `You have a new application for ${n.data.job_title}.`;
                    }

                    return (
                        <li key={n.id} className={`p-2 border-b ${n.read ? "bg-gray-100" : "bg-white"}`}>
                            <p>{message}</p>
                            {!n.read && (
                                <button onClick={() => handleMarkAsRead(n.id)} className="text-blue-500 text-sm">
                                    Mark as read
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Clear all read notifications button */}
            {notifications.some(n => n.read) && (
                <button
                    onClick={handleClearRead}
                    className="text-red-500 text-sm mt-2"
                >
                    Clear read notifications
                </button>
            )}
        </div>
    );
}
