import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ajax from './ajax';
import DealList from './components/DealList';
import DealDetail from './components/DealDetail';
import SearchBar from './components/SearchBar';

const App = () => {
  useEffect(() => {
    const fetch = async () => {
      setDeals(await ajax.fetchInitialDeals());
    };
    fetch();
    return () => {};
  }, []);

  const [deals, setDeals] = useState([]);
  const [dealsFromSearch, setDealsFromSearch] = useState([]);
  const [currentDealId, setCurrentDealId] = useState(null);

  const dealsToDisplay = dealsFromSearch.length > 0 ? dealsFromSearch : deals;

  const currentDeal = () =>
    dealsToDisplay.find(deal => deal.key === currentDealId);

  const searchDeals = async searchTerm => {
    if (searchTerm) {
      setDealsFromSearch(await ajax.fetchDealsSearchResults(searchTerm));
    } else {
      setDealsFromSearch([]);
    }
  };

  if (currentDealId) {
    return (
      <View style={styles.main}>
        <DealDetail
          initialDealData={currentDeal()}
          onBack={() => setCurrentDealId(null)}
        />
      </View>
    );
  } else if (dealsToDisplay.length > 0) {
    return (
      <View style={styles.main}>
        <SearchBar searchDeals={searchDeals} />
        <DealList deals={dealsToDisplay} onItemPress={setCurrentDealId} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Bakesale</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    marginTop: 30,
  },
  header: {
    fontSize: 40,
  },
});

export default App;
