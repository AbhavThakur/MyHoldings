import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import HoldingsList from './src/screens/HoldingsList';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HoldingsList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
