import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }
      
      return true;
    } else {
      console.log('Must use physical device for Push Notifications');
      return false;
    }
  }

  static async scheduleDailyNotification() {
    // Cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule daily notification at 8:00 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Inspiration",
        body: "Your daily quote and bible verse are ready! 📖✨",
        data: { type: 'daily_inspiration' },
      },
      trigger: {
        hour: 8,
        minute: 0,
        repeats: true,
      },
    });

    // Schedule another notification at 6:00 PM for evening inspiration
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Evening Reflection",
        body: "Time for your evening dose of inspiration! 🌙",
        data: { type: 'evening_reflection' },
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });
  }

  static async sendImmediateNotification(quote: string, author: string, verse: string, verseRef: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Today's Quote",
        body: `"${quote}" - ${author}`,
        data: { type: 'quote', quote, author },
      },
      trigger: null, // Send immediately
    });

    // Send bible verse notification after a short delay
    setTimeout(async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Bible Verse of the Day",
          body: `${verse} (${verseRef})`,
          data: { type: 'verse', verse, verseRef },
        },
        trigger: null, // Send immediately
      });
    }, 2000);
  }

  static async addNotificationListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  static async addResponseListener(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
} 