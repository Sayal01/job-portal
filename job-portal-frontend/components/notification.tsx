"use client";

import { markNotificationAsRead, clearReadNotifications } from "../lib/notification";

interface InterviewScheduledData {
    job_title: string;
    round_number: number;
    scheduled_at: string;
    interviewer_name: string;
}

interface InterviewUpdateData {
    job_title: string;
    round_number: number;
    status: "passed" | "failed" | "completed" | "scheduled";
    scheduled_at?: string;
    interviewer_name?: string;
}

interface ApplicationStatusData {
    job_title: string;
    status: "pending" | "shortlisted" | "in_interview" | "selected" | "rejected";
}

type NotificationData =
    | InterviewScheduledData
    | InterviewUpdateData
    | ApplicationStatusData;

export interface NotificationType {
    id: number;
    type: "interview_scheduled" | "interview_update" | "application_status_update" | string;
    data: NotificationData;
    read: boolean;
    created_at: string;
}

interface NotificationsDropdownProps {
    notifications: NotificationType[];
    setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
}

export default function NotificationsDropdown({
    notifications = [],
    setNotifications,
}: NotificationsDropdownProps) {
    const handleMarkAsRead = async (id: number) => {
        await markNotificationAsRead(id);
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handleClearRead = async () => {
        await clearReadNotifications();
        setNotifications(prev => prev.filter(n => !n.read));
    };

    const renderMessage = (n: NotificationType) => {
        switch (n.type) {
            case "interview_scheduled": {
                const d = n.data as InterviewScheduledData;
                return `Your interview for ${d.job_title} (Round ${d.round_number}) is scheduled at ${new Date(
                    d.scheduled_at
                ).toLocaleString()} with ${d.interviewer_name}.`;
            }
            case "interview_update": {
                const d = n.data as InterviewUpdateData;
                switch (d.status) {
                    case "passed":
                        return `Congrats! You passed Round ${d.round_number} for ${d.job_title}.`;
                    case "failed":
                        return `We’re sorry. You failed Round ${d.round_number} for ${d.job_title}.`;
                    case "completed":
                        return `Your interview for ${d.job_title} (Round ${d.round_number}) was completed.`;
                    case "scheduled":
                        return `Your interview for ${d.job_title} (Round ${d.round_number}) is scheduled at ${new Date(
                            d.scheduled_at!
                        ).toLocaleString()} with ${d.interviewer_name}.`;
                    default:
                        return `Interview update for ${d.job_title} (Round ${d.round_number}).`;
                }
            }
            case "application_status_update": {
                const d = n.data as ApplicationStatusData;
                switch (d.status) {
                    case "pending":
                        return `Your application for ${d.job_title} has been received.`;
                    case "shortlisted":
                        return `Your application for ${d.job_title} has been shortlisted.`;
                    case "in_interview":
                        return `Your application for ${d.job_title} is in the interview stage.`;
                    case "selected":
                        return `Congratulations! Your application for ${d.job_title} has been selected.`;
                    case "rejected":
                        return `Your application for ${d.job_title} has been rejected.`;
                }
            }
            default:
                return `You have a new application.`;
        }
    };

    return (
        <div className="p-4 w-80 bg-white shadow rounded">
            <h3 className="font-bold mb-2">Notifications</h3>
            <ul>
                {notifications.length === 0 && (
                    <li className="p-2 text-gray-500">No notifications</li>
                )}
                {notifications.map(n => (
                    <li
                        key={n.id}
                        className={`p-2 border-b ${n.read ? "bg-gray-100" : "bg-white"}`}
                    >
                        <p>{renderMessage(n)}</p>
                        {!n.read && (
                            <button
                                onClick={() => handleMarkAsRead(n.id)}
                                className="text-blue-500 text-sm"
                            >
                                Mark as read
                            </button>
                        )}
                    </li>
                ))}
            </ul>

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
