import React, {useEffect, useState, useCallback} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const SearchBar = ({searchDeals}) => {
  const [searchTerm, setSearchTerm] = useState(null);
  const interval = React.useRef();
  const searchDealsCallback = useCallback(searchDeals, [searchDeals]);

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    interval.current = setInterval(() => {
      searchDealsCallback(searchTerm);
      clearInterval(interval.current);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <TextInput
      style={styles.input}
      placeholder="Search All Deals"
      onChangeText={setSearchTerm}
    />
  );
};

SearchBar.propTypes = {
  searchDeals: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});

export default SearchBar;
