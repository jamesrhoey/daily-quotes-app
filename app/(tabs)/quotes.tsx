import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NotificationService } from '../../services/NotificationService';
import { StorageService } from '../../services/StorageService';

// More reliable APIs
const QUOTE_API = 'https://api.quotable.io/random';
const BIBLE_API = 'https://labs.bible.org/api/?passage=random&format=json';

// Fallback data in case APIs fail
const FALLBACK_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" }
];

const FALLBACK_VERSES = [
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
  { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
  { text: "The Lord is my shepherd, I shall not want.", reference: "Psalm 23:1" },
  { text: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28" },
  { text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", reference: "1 Corinthians 13:4" },
  { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.", reference: "Isaiah 40:31" },
  { text: "The Lord is my light and my salvation—whom shall I fear?", reference: "Psalm 27:1" },
  { text: "Give thanks to the Lord, for he is good; his love endures forever.", reference: "Psalm 107:1" }
];

export default function QuotesScreen() {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [verse, setVerse] = useState<string | null>(null);
  const [verseRef, setVerseRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const getRandomFallbackQuote = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  };

  const getRandomFallbackVerse = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_VERSES.length);
    return FALLBACK_VERSES[randomIndex];
  };

  const loadContent = async () => {
    setLoading(true);
    
    try {
      // First, try to load saved content from today
      const savedContent = await StorageService.getDailyContent();
      const isFromToday = await StorageService.isContentFromToday();
      
      if (isFromToday && savedContent.quote && savedContent.verse) {
        // Use saved content from today
        setQuote(savedContent.quote.text);
        setAuthor(savedContent.quote.author);
        setVerse(savedContent.verse.text);
        setVerseRef(savedContent.verse.reference);
        setLoading(false);
        return;
      }
      
      // If no saved content from today, try to fetch new content
      let quoteLoaded = false;
      let verseLoaded = false;
      let newQuote = '';
      let newAuthor = '';
      let newVerse = '';
      let newVerseRef = '';

      try {
        // Try to fetch daily quote
        console.log('Fetching quote from:', QUOTE_API);
        const quoteRes = await fetch(QUOTE_API, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (quoteRes.ok) {
          const quoteJson = await quoteRes.json();
          console.log('Quote response:', quoteJson);
          if (quoteJson.content && quoteJson.author) {
            newQuote = quoteJson.content;
            newAuthor = quoteJson.author;
            quoteLoaded = true;
          }
        }
      } catch (e) {
        console.log('Quote API error:', e);
      }

      try {
        // Try to fetch daily bible verse
        console.log('Fetching verse from:', BIBLE_API);
        const verseRes = await fetch(BIBLE_API, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (verseRes.ok) {
          const verseJson = await verseRes.json();
          console.log('Verse response:', verseJson);
          if (verseJson && verseJson.length > 0) {
            newVerse = verseJson[0].text;
            newVerseRef = verseJson[0].bookname + ' ' + verseJson[0].chapter + ':' + verseJson[0].verse;
            verseLoaded = true;
          }
        }
      } catch (e) {
        console.log('Verse API error:', e);
      }

      // Use fallback data if APIs failed
      if (!quoteLoaded) {
        const fallbackQuote = getRandomFallbackQuote();
        newQuote = fallbackQuote.text;
        newAuthor = fallbackQuote.author;
      }

      if (!verseLoaded) {
        const fallbackVerse = getRandomFallbackVerse();
        newVerse = fallbackVerse.text;
        newVerseRef = fallbackVerse.reference;
      }

      // Save the new content locally
      await StorageService.saveDailyContent(newQuote, newAuthor, newVerse, newVerseRef);
      
      // Update state
      setQuote(newQuote);
      setAuthor(newAuthor);
      setVerse(newVerse);
      setVerseRef(newVerseRef);
      
    } catch (error) {
      console.error('Error loading content:', error);
      // Use fallback data if everything fails
      const fallbackQuote = getRandomFallbackQuote();
      const fallbackVerse = getRandomFallbackVerse();
      
      setQuote(fallbackQuote.text);
      setAuthor(fallbackQuote.author);
      setVerse(fallbackVerse.text);
      setVerseRef(fallbackVerse.reference);
    } finally {
      setLoading(false);
    }
  };

  const enableNotifications = async () => {
    const granted = await NotificationService.requestPermissions();
    if (granted) {
      await NotificationService.scheduleDailyNotification();
      setNotificationsEnabled(true);
      Alert.alert('Success', 'Daily notifications enabled! You\'ll receive quotes and verses at 8 AM and 6 PM.');
    } else {
      Alert.alert('Permission Denied', 'Please enable notifications in your device settings to receive daily inspiration.');
    }
  };

  const sendNowNotification = async () => {
    if (quote && author && verse && verseRef) {
      await NotificationService.sendImmediateNotification(quote, author, verse, verseRef);
      Alert.alert('Sent!', 'Check your notifications for today\'s inspiration!');
    }
  };

  const refreshContent = async () => {
    // Clear saved content to force refresh
    await StorageService.saveDailyContent('', '', '', '');
    await loadContent();
  };

  useEffect(() => {
    loadContent();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your daily inspiration...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Daily Quote</Text>
        <Text style={styles.quote}>&ldquo;{quote}&rdquo;</Text>
        <Text style={styles.author}>— {author}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Bible Verse of the Day</Text>
        <Text style={styles.verse}>{verse}</Text>
        <Text style={styles.verseRef}>{verseRef}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={sendNowNotification}>
          <Text style={styles.buttonText}>Send to Notifications Now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={refreshContent}>
          <Text style={styles.buttonText}>Get New Inspiration</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, notificationsEnabled ? styles.buttonDisabled : styles.buttonPrimary]} 
          onPress={enableNotifications}
          disabled={notificationsEnabled}
        >
          <Text style={styles.buttonText}>
            {notificationsEnabled ? 'Notifications Enabled ✓' : 'Enable Daily Notifications'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
    color: '#444',
  },
  author: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  verse: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
    color: '#444',
  },
  verseRef: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 