import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

// Fallback data for web version
const FALLBACK_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" }
];

const FALLBACK_VERSES = [
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
  { text: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" },
  { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
  { text: "The Lord is my shepherd, I shall not want.", reference: "Psalm 23:1" }
];

export default function WebApp() {
  const [quote, setQuote] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [verse, setVerse] = useState<string | null>(null);
  const [verseRef, setVerseRef] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      const randomVerse = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
      
      setQuote(randomQuote.text);
      setAuthor(randomQuote.author);
      setVerse(randomVerse.text);
      setVerseRef(randomVerse.reference);
      setLoading(false);
    }, 1000);
  }, []);

  const refreshContent = () => {
    setLoading(true);
    setTimeout(() => {
      const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      const randomVerse = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
      
      setQuote(randomQuote.text);
      setAuthor(randomQuote.author);
      setVerse(randomVerse.text);
      setVerseRef(randomVerse.reference);
      setLoading(false);
    }, 500);
  };

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
      <Text style={styles.appTitle}>Daily Quotes & Bible Verse</Text>
      
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

      <TouchableOpacity style={styles.refreshButton} onPress={refreshContent}>
        <Text style={styles.buttonText}>Get New Inspiration</Text>
      </TouchableOpacity>
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
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
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
  refreshButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 