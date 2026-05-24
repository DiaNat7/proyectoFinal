import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';


export default function OfertaFormScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioAnterior, setPrecioAnterior] = useState('');
  const [precioActual, setPrecioActual] = useState('');
  const [imagen, setImagen] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!titulo || !precioAnterior || !precioActual) {
      Alert.alert('Error', 'El título y los precios son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      // USAMOS FETCH NATIVO directo a tu puerto 3000
      const response = await fetch('http://localhost:3000/ofertas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: titulo,
          descripcion: descripcion, 
          precioAnterior: Number(precioAnterior),
          precioActual: Number(precioActual),
          imagen: imagen.trim() || "https://via.placeholder.com/300x150.png?text=Oferta+Sin+Imagen"
        })
      });
      
      // Verificamos si el servidor nos mandó un error (ej. 400 o 500)
      if (!response.ok) {
        throw new Error(`El servidor rechazó la petición (Error ${response.status})`);
      }
      
      Alert.alert('¡Éxito!', 'La oferta se guardó en la base de datos.');
      
      setTitulo('');
      setDescripcion('');
      setPrecioAnterior('');
      setPrecioActual('');
      setImagen('');
      
      navigation.navigate('Inicio'); 

    } catch (error) {
      console.error("Detalle del error al guardar:", error); 
      Alert.alert('Error de Conexión', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Crear Oferta</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Título de la promoción *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej. 2x1 en Frapuccinos" 
          value={titulo} 
          onChangeText={setTitulo} 
        />

        <Text style={styles.label}>Descripción (Opcional)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej. Válido solo los martes en sucursal" 
          value={descripcion} 
          onChangeText={setDescripcion} 
        />
        
        <Text style={styles.label}>Precio Anterior ($) *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej. 120" 
          value={precioAnterior} 
          onChangeText={setPrecioAnterior} 
          keyboardType="numeric" 
        />

        <Text style={styles.label}>Precio de Oferta Actual ($) *</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej. 85" 
          value={precioActual} 
          onChangeText={setPrecioActual} 
          keyboardType="numeric" 
        />

        <Text style={styles.label}>Enlace (URL) de la Imagen (Opcional)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ej. https://imagenes.com/mi-promo.jpg" 
          value={imagen} 
          onChangeText={setImagen} 
          autoCapitalize="none"
          keyboardType="url"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#E75480" style={{ marginTop: 10 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleGuardar}>
            <Text style={styles.buttonText}>Guardar Oferta</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={{ height: 60 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F5', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#E75480', marginBottom: 20, textAlign: 'center', marginTop: 40 },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#FFB6C1', elevation: 3 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#fafafa', fontSize: 16 },
  button: { backgroundColor: '#E75480', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});