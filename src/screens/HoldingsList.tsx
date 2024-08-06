import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Holding {
  symbol: string;
  quantity: number;
  ltp: number;
  avgPrice: number;
  close: number;
}

const HoldingsList: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await axios.get(
          'https://35dee773a9ec441e9f38d5fc249406ce.api.mockbin.io/',
        );
        if (Array.isArray(response.data.data.userHolding)) {
          setHoldings(response.data.data.userHolding);
        } else {
          setError('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchHoldings();
  }, []);

  const calculateValues = (holding: Holding) => {
    const currentValue = holding.ltp * holding.quantity;
    const investmentValue = holding.avgPrice * holding.quantity;
    const pnl = currentValue - investmentValue;
    const todaysPnl = (holding.close - holding.ltp) * holding.quantity;
    return {currentValue, investmentValue, pnl, todaysPnl};
  };

  const totalValues = () => {
    return holdings.reduce(
      (acc, holding) => {
        const {currentValue, investmentValue, pnl, todaysPnl} =
          calculateValues(holding);
        acc.currentValueTotal += currentValue;
        acc.investmentTotal += investmentValue;
        acc.pnlTotal += pnl;
        acc.todaysPnlTotal += todaysPnl;
        return acc;
      },
      {
        currentValueTotal: 0,
        investmentTotal: 0,
        pnlTotal: 0,
        todaysPnlTotal: 0,
      },
    );
  };

  const {currentValueTotal, investmentTotal, pnlTotal, todaysPnlTotal} =
    totalValues();

  const ItemSeparator = () => <View style={styles.separator} />;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Upstox Holding</Text>
      </View>
      <FlatList
        data={holdings}
        keyExtractor={item => item.symbol}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({item}) => {
          const {currentValue, investmentValue, pnl} = calculateValues(item);
          return (
            <View style={styles.item}>
              <View>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>
                  Investment: {'\u20B9'}
                  {investmentValue.toFixed(2)}
                </Text>
              </View>
              <View>
                <Text>
                  LTP:{'\u20B9'} {item.ltp}
                </Text>
                <Text>
                  P&L: {'\u20B9'}
                  {pnl.toFixed(2)}
                </Text>
                <Text>
                  Current: {'\u20B9'}
                  {currentValue.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text
          style={[
            styles.header,
            {color: expanded ? '#827474cc' : 'purple', alignSelf: 'center'},
          ]}>
          {expanded ? 'Hide' : 'Show'} Summary
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.Summary}>
          <View>
            <Text style={styles.symbol}>Total Current Value: </Text>
            <Text style={styles.symbol}>Total Investment: </Text>
            <Text style={styles.symbol}>Total P&L: </Text>
            <Text style={styles.symbol}>Today's P&L: </Text>
          </View>
          <View>
            <Text>
              {'\u20B9'}
              {currentValueTotal.toFixed(2)}
            </Text>
            <Text>
              {'\u20B9'}
              {investmentTotal.toFixed(2)}
            </Text>
            <Text>
              {'\u20B9'}
              {pnlTotal.toFixed(2)}
            </Text>
            <Text>
              {'\u20B9'}
              {todaysPnlTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  headerContainer: {
    backgroundColor: 'purple',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
  },
  item: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  separator: {
    height: 1,
    backgroundColor: 'grey',
    width: '100%',
  },
  symbol: {
    fontWeight: 'bold',
  },
  Summary: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HoldingsList;
