import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {priceDisplay} from '../util';
import ajax from '../ajax';

const DealDetail = ({initialDealData, onBack}) => {
  const [deal, setDeal] = useState(initialDealData);

  useEffect(() => {
    const fetchDealDetail = async () => {
      setDeal(await ajax.fetchDealDetail(deal.key));
    };
    fetchDealDetail();
  }, [deal]);

  return (
    <View style={styles.deal}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backLink}>Back</Text>
      </TouchableOpacity>
      <Image source={{uri: deal.media[0]}} style={styles.image} />
      <View style={styles.detail}>
        <View>
          <Text style={styles.title}>{deal.title}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.info}>
            <Text style={styles.cause}>{deal.cause.name}</Text>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          </View>
          {deal.user && (
            <View>
              <Image source={{uri: deal.user.avatar}} style={styles.avatar} />
              <Text>{deal.user.name}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.description}>
        <Text>{deal.description}</Text>
      </View>
    </View>
  );
};

DealDetail.propTypes = {
  initialDealData: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  deal: {
    marginHorizontal: 12,
  },
  backLink: {
    marginBottom: 5,
    color: '#22f',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  detail: {
    borderColor: '#bbb',
    borderWidth: 1,
  },
  info: {
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#bbb',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  title: {
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(237, 149, 45, 0.4)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    textAlign: 'right',
  },
  avatar: {
    height: 60,
    width: 60,
  },
});

export default DealDetail;
