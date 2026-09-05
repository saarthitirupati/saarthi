package `in`.saarthiguide.travel

import android.content.Context
import android.content.Intent
import android.net.Uri

object UrlInterceptor {

    private val ALLOWED_HOSTS = setOf(
        "www.saarthiguide.in",
        "saarthiguide.in"
    )

    fun shouldOverrideUrl(context: Context, urlString: String): Boolean {
        val uri = Uri.parse(urlString) ?: return false
        val scheme = uri.scheme?.lowercase() ?: return false

        when (scheme) {
            "tel", "mailto", "sms", "whatsapp", "upi", "geo" -> {
                launchExternalIntent(context, Intent(Intent.ACTION_VIEW, uri))
                return true
            }
        }

        if (scheme == "intent") {
            try {
                val intent = Intent.parseUri(urlString, Intent.URI_INTENT_SCHEME)
                if (intent != null) {
                    val packageManager = context.packageManager
                    val info = packageManager.resolveActivity(intent, 0)
                    if (info != null) {
                        context.startActivity(intent)
                    } else {
                        val fallbackUrl = intent.getStringExtra("browser_fallback_url")
                        if (!fallbackUrl.isNullOrEmpty()) {
                            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl))
                            launchExternalIntent(context, browserIntent)
                        }
                    }
                    return true
                }
            } catch (e: Exception) {
                // Ignore malformed intent URI
            }
        }

        if (scheme == "http" || scheme == "https") {
            val host = uri.host?.lowercase() ?: return false
            if (ALLOWED_HOSTS.contains(host)) {
                return false
            } else {
                launchExternalIntent(context, Intent(Intent.ACTION_VIEW, uri))
                return true
            }
        }

        return false
    }

    private fun launchExternalIntent(context: Context, intent: Intent) {
        try {
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        } catch (e: Exception) {
            // Target app not available
        }
    }
}
