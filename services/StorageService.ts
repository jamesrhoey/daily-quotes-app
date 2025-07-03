import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedQuote {
  text: string;
  author: string;
  date: string;
}

export interface SavedVerse {
  text: string;
  reference: string;
  date: string;
}

export class StorageService {
  static async saveDailyContent(quote: string, author: string, verse: string, verseRef: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const savedQuote: SavedQuote = {
        text: quote,
        author: author,
        date: today
      };
      
      const savedVerse: SavedVerse = {
        text: verse,
        reference: verseRef,
        date: today
      };
      
      await AsyncStorage.setItem('dailyQuote', JSON.stringify(savedQuote));
      await AsyncStorage.setItem('dailyVerse', JSON.stringify(savedVerse));
      await AsyncStorage.setItem('lastUpdate', today);
      
      console.log('Content saved locally');
    } catch (error) {
      console.error('Error saving content:', error);
    }
  }
  
  static async getDailyContent(): Promise<{quote: SavedQuote | null, verse: SavedVerse | null}> {
    try {
      const quoteData = await AsyncStorage.getItem('dailyQuote');
      const verseData = await AsyncStorage.getItem('dailyVerse');
      
      const quote = quoteData ? JSON.parse(quoteData) : null;
      const verse = verseData ? JSON.parse(verseData) : null;
      
      return { quote, verse };
    } catch (error) {
      console.error('Error getting content:', error);
      return { quote: null, verse: null };
    }
  }
  
  static async isContentFromToday(): Promise<boolean> {
    try {
      const lastUpdate = await AsyncStorage.getItem('lastUpdate');
      const today = new Date().toISOString().split('T')[0];
      
      return lastUpdate === today;
    } catch (error) {
      console.error('Error checking date:', error);
      return false;
    }
  }
  
  static async saveFavoriteQuotes(quotes: SavedQuote[]) {
    try {
      await AsyncStorage.setItem('favoriteQuotes', JSON.stringify(quotes));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }
  
  static async getFavoriteQuotes(): Promise<SavedQuote[]> {
    try {
      const data = await AsyncStorage.getItem('favoriteQuotes');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }
} 