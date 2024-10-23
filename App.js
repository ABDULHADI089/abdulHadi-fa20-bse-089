
// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import useQuranData from './useQuranData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SURAH_ENDPOINT = 'https://api.alquran.cloud/v1/quran/en.asad';

const App = () => {
  const { data, loading, error } = useQuranData(SURAH_ENDPOINT);
  const [offlineData, setOfflineData] = useState(null);

  // Save data to AsyncStorage for offline usage
  useEffect(() => {
    if (data) {
      AsyncStorage.setItem('surahData', JSON.stringify(data));
    }
  }, [data]);

  // Load data from AsyncStorage if offline
  useEffect(() => {
    const fetchOfflineData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('surahData');
        if (storedData) {
          setOfflineData(JSON.parse(storedData));
        }
      } catch (err) {
        console.error('Failed to load offline data', err);
      }
    };

    fetchOfflineData();
  }, []);

  const renderSurahItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.surahNumber}>{item.number}</Text>
        <View style={styles.surahInfo}>
          <Text style={styles.title}>{item.englishName}</Text>
          <Text style={styles.subtitle}>{item.englishNameTranslation}</Text>
        </View>
        <Text style={styles.arabicName}>{item.name}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  const displayData = error ? offlineData?.data : data?.data;

  if (!displayData) {
    return <Text style={styles.errorText}>Error fetching data. Please check your internet connection.</Text>;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('./assets/images/quran.jpg')} style={styles.logo} />
          <Text style={styles.headerTitle}>QuranApp</Text>
        </View>
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.number.toString()}
          renderItem={renderSurahItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginRight: 10,
  },
  surahInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  arabicName: {
    fontSize: 20,
    color: '#4a90e2',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});

export default App;