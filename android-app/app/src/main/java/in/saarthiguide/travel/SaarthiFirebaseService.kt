package `in`.saarthiguide.travel

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

/**
 * Saarthi Native Android FCM Service
 * Handles background lock-screen notifications & deep-link dispatch
 */
class SaarthiFirebaseService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Store FCM Token locally for registration with Saarthi backend
        getSharedPreferences("saarthi_prefs", Context.MODE_PRIVATE)
            .edit()
            .putString("fcm_token", token)
            .apply()
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val title = remoteMessage.notification?.title 
            ?: remoteMessage.data["title"] 
            ?: "Saarthi Alert"
            
        val body = remoteMessage.notification?.body 
            ?: remoteMessage.data["body"] 
            ?: ""
            
        val deepLink = remoteMessage.data["deepLink"] 
            ?: "https://www.saarthiguide.in"

        showLockScreenNotification(title, body, deepLink)
    }

    private fun showLockScreenNotification(title: String, body: String, targetUrl: String) {
        val channelId = "saarthi_live_alerts"
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Tirumala Live Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Urgent crowd, temple timing, and travel updates"
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP
            data = Uri.parse(targetUrl)
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
}
