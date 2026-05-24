import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';

export default function TiendaFormScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [logo, setLogo] = useState('');
  const [contacto, setContacto] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    // Según tu modelo, solo el nombre es obligatorio
    if (!nombre) { 
      Alert.alert('Error', 'El nombre de la tienda es obligatorio.'); 
      return; 
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/tiendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: nombre, 
          ubicacion: ubicacion, 
          logo: logo.trim(), 
          contacto: contacto 
          // Omitimos 'categoria' temporalmente para evitar el CastError de MongoDB
        })
      });

      if (!response.ok) {
        throw new Error("El servidor rechazó los datos");
      }

      Alert.alert('¡Éxito!', 'Tienda registrada correctamente en la base de datos.');
      
      // Limpiamos el formulario
      setNombre('');
      setUbicacion('');
      setLogo('');
      setContacto('');
      
      // Regresamos al catálogo
      navigation.navigate('Tiendas');
    } catch (error) { 
      Alert.alert('Error de Conexión', 'No se pudo guardar la tienda.'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Nueva Tienda</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Nombre de la Tienda *</Text>
        <TextInput 
          style={styles.input} 
          value={nombre} 
          onChangeText={setNombre} 
          placeholder="Ej. Oxxo, Zara..." 
        />
        
        <Text style={styles.label}>Ubicación</Text>
        <TextInput 
          style={styles.input} 
          value={ubicacion} 
          onChangeText={setUbicacion} 
          placeholder="Ej. Plaza Principal L-12" 
        />
        
        <Text style={styles.label}>Contacto (Teléfono o Email)</Text>
        <TextInput 
          style={styles.input} 
          value={contacto} 
          onChangeText={setContacto} 
          placeholder="Ej. 476-123-4567" 
        />

        <Text style={styles.label}>URL del Logo (Opcional)</Text>
        <TextInput 
          style={styles.input} 
          value={logo} 
          onChangeText={setLogo} 
          placeholder="https://misitio.com/logo.png" 
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#E75480" style={{ marginTop: 10 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleGuardar}>
            <Text style={styles.buttonText}>Registrar Tienda</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F5', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#E75480', textAlign: 'center', marginTop: 40, marginBottom: 20 },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#FFB6C1', elevation: 3 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#E75480', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});