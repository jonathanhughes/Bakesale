import React, {useEffect, useState} from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Easing,
  Dimensions,
} from 'react-native';
import ajax from './ajax';
import DealList from './components/DealList';
import DealDetail from './components/DealDetail';
import SearchBar from './components/SearchBar';

const App = () => {
  const [deals, setDeals] = useState([]);
  const [dealsFromSearch, setDealsFromSearch] = useState([]);
  const [currentDealId, setCurrentDealId] = useState(null);
  const titleXPos = new Animated.Value(0);

  const dealsToDisplay = dealsFromSearch.length > 0 ? dealsFromSearch : deals;

  const animateTitle = (direction = 1) => {
    console.log('ANIMATE');
    const width = Dimensions.get('window').width - 150;
    Animated.timing(titleXPos, {
      toValue: direction * (width / 2),
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        animateTitle(-1 * direction);
      }
    });
  };

  useEffect(() => {
    const fetch = async () => {
      setDeals(await ajax.fetchInitialDeals());
    };
    fetch();
    animateTitle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <Animated.View style={[{left: titleXPos}, styles.container]}>
        <Text style={styles.header}>Bakesale</Text>
      </Animated.View>
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
