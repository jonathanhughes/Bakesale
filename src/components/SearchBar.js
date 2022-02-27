import React, {useEffect, useState, useCallback, useRef} from 'react';
import {TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const SearchBar = ({searchDeals, initialSearchTerm}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const interval = React.useRef();
  const searchDealsCallback = useCallback(searchDeals, [searchDeals]);
  const inputElement = useRef();

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    interval.current = setInterval(() => {
      inputElement?.current?.blur();
      searchDealsCallback(searchTerm);
      clearInterval(interval.current);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <TextInput
      ref={inputElement}
      style={styles.input}
      value={searchTerm}
      placeholder="Search All Deals"
      onChangeText={setSearchTerm}
    />
  );
};

SearchBar.propTypes = {
  searchDeals: PropTypes.func.isRequired,
  initialSearchTerm: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});

export default SearchBar;
