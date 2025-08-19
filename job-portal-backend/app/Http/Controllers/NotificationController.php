<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    //
    // Get all notifications for logged-in user
    public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($notifications);
    }

    // Mark a notification as read
    public function markAsRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
        $notification->update(['read' => true]);
        return response()->json(['message' => 'Notification marked as read']);
    }
    public function clearRead()
    {
        $user = auth()->user();

        $deleted = \App\Models\Notification::where('user_id', $user->id)
            ->where('read', true)
            ->delete();

        return response()->json([
            'status' => 'success',
            'message' => "$deleted notifications cleared"
        ]);
    }
}
