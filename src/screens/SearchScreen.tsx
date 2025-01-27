import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RECENT_SEARCHES = [
  'Pizza',
  'Burger',
  'Sushi',
  'Italian',
];

const POPULAR_CUISINES = [
  { id: '1', name: 'Italian', count: '150+ places' },
  { id: '2', name: 'Chinese', count: '120+ places' },
  { id: '3', name: 'Japanese', count: '90+ places' },
  { id: '4', name: 'Mexican', count: '80+ places' },
];

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants or dishes"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Recent Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentSearches}>
            {RECENT_SEARCHES.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchItem}
              >
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Cuisines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Cuisines</Text>
          {POPULAR_CUISINES.map((cuisine) => (
            <TouchableOpacity
              key={cuisine.id}
              style={styles.cuisineItem}
            >
              <Text style={styles.cuisineName}>{cuisine.name}</Text>
              <Text style={styles.cuisineCount}>{cuisine.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentSearchItem: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recentSearchText: {
    color: '#4B5563',
    fontSize: 14,
  },
  cuisineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cuisineName: {
    fontSize: 16,
    color: '#1F2937',
  },
  cuisineCount: {
    fontSize: 14,
    color: '#6B7280',
  },
});
