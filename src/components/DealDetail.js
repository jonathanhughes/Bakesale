import React, {useEffect, useState, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import {priceDisplay} from '../util';
import ajax from '../ajax';
import usePrevious from '../usePrevious';

const DealDetail = ({initialDealData, onBack}) => {
  const [deal, setDeal] = useState(initialDealData);
  const [imageIndex, setImageIndex] = useState(0);
  const previousImageIndex = usePrevious(imageIndex);
  const imageXPos = useRef(new Animated.Value(0)).current;
  const width = Dimensions.get('window').width;

  const imagePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gs) => {
          imageXPos.setValue(gs.dx);
        },
        onPanResponderRelease: (evt, gs) => {
          const direction = Math.sign(gs.dx);
          if (
            deal.media[imageIndex - direction] &&
            Math.abs(gs.dx) > width * 0.4
          ) {
            Animated.timing(imageXPos, {
              toValue: direction * width,
              duration: 250,
              useNativeDriver: false,
            }).start(() => setImageIndex(imageIndex - direction));
          } else {
            Animated.spring(imageXPos, {
              toValue: 0,
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageIndex, width],
  );

  useEffect(() => {
    const direction = previousImageIndex > imageIndex ? -1 : 1;
    if (previousImageIndex || previousImageIndex === 0) {
      imageXPos.setValue(direction * width);
      Animated.spring(imageXPos, {toValue: 0, useNativeDriver: false}).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageIndex]);

  useEffect(() => {
    const fetchDealDetail = async () => {
      setDeal(await ajax.fetchDealDetail(deal.key));
    };
    fetchDealDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDeal = () => {
    Linking.openURL(deal.url);
  };

  return (
    <View style={styles.deal}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backLink}>Back</Text>
      </TouchableOpacity>
      <Animated.Image
        {...imagePanResponder.panHandlers}
        source={{uri: deal.media[imageIndex]}}
        style={[{left: imageXPos}, styles.image]}
      />
      <View>
        <Text style={styles.title}>{deal.title}</Text>
      </View>
      <ScrollView style={styles.detail}>
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
        <View style={styles.description}>
          <Text>{deal.description}</Text>
        </View>
        <Button title="Buy this deal!" onPress={openDeal} />
      </ScrollView>
    </View>
  );
};

DealDetail.propTypes = {
  initialDealData: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  detail: {
    marginBottom: 20,
  },
  backLink: {
    marginBottom: 10,
    color: '#8645ad',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  info: {
    alignItems: 'center',
  },
  user: {
    alignItems: 'center',
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
