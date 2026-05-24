import { registerRootComponent } from 'expo';
import { View, Text } from 'react-native';

// Tu componente directamente aquí
function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E1E' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#00FF00' }}>
        ¡SISTEMA EN LÍNEA!
      </Text>
    </View>
  );
}

// Forzamos a Expo a usar este componente
registerRootComponent(App);