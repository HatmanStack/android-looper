import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider, Button, Card } from 'react-native-paper';
import { looperTheme } from './src/theme/paperTheme';

export default function App() {
  return (
    <PaperProvider theme={looperTheme}>
      <View style={styles.container}>
        <Text style={styles.title}>Looper - Audio Mixing App</Text>
        <Text style={styles.subtitle}>Phase 1: Project Setup Complete</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardText}>React Native Paper Theme Configured</Text>
            <Text style={styles.cardText}>✓ Dark Material Design</Text>
            <Text style={styles.cardText}>✓ Custom Purple Accent (#BB86FC)</Text>
          </Card.Content>
        </Card>

        <Button mode="contained" style={styles.button}>
          Example Button
        </Button>

        <StatusBar style="light" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Match theme background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#E1E1E1',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#CACACA',
    fontSize: 16,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  cardText: {
    color: '#E1E1E1',
    marginBottom: 4,
  },
  button: {
    marginTop: 10,
  },
});
