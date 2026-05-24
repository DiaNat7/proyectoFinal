import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';

export default function OfertaEditScreen({ route, navigation }) {
  const { oferta } = route.params;

  const [titulo, setTitulo] = useState(oferta.titulo);
  const [descripcion, setDescripcion] = useState(oferta.descripcion || '');
  const [precioAnterior, setPrecioAnterior] = useState(oferta.precioAnterior.toString());
  const [precioActual, setPrecioActual] = useState(oferta.precioActual.toString());
  const [imagen, setImagen] = useState(oferta.imagen || '');
  const [loading, setLoading] = useState(false);

  const handleActualizar = async () => {
    if (!titulo || !precioAnterior || !precioActual) {
      Alert.alert('Error', 'El título y los precios son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      // Usamos el método PUT y el ID de la oferta en la URL
      const response = await fetch(`http://localhost:3000/ofertas/${oferta._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descripcion,
          precioAnterior: Number(precioAnterior),
          precioActual: Number(precioActual),
          imagen: imagen.trim()
        })
      });

      if (!response.ok) throw new Error("Error al actualizar");

      Alert.alert('¡Éxito!', 'La promoción se ha actualizado correctamente.');
      
      // Regresamos al Inicio para ver los cambios reflejados
      navigation.navigate('Inicio'); 

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Editar Promoción</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Título *</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Descripción</Text>
        <TextInput style={styles.input} value={descripcion} onChangeText={setDescripcion} multiline />
        
        <Text style={styles.label}>Precio de Lista ($) *</Text>
        <TextInput style={styles.input} value={precioAnterior} onChangeText={setPrecioAnterior} keyboardType="numeric" />

        <Text style={styles.label}>Precio de Oferta ($) *</Text>
        <TextInput style={styles.input} value={precioActual} onChangeText={setPrecioActual} keyboardType="numeric" />

        <Text style={styles.label}>URL de la Imagen</Text>
        <TextInput style={styles.input} value={imagen} onChangeText={setImagen} autoCapitalize="none" />

        {loading ? (
          <ActivityIndicator size="large" color="#E75480" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleActualizar}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.txtCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F5', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#E75480', marginBottom: 20, textAlign: 'center', marginTop: 40 },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#FFB6C1' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#E75480', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnCancelar: { marginTop: 15, alignItems: 'center' },
  txtCancelar: { color: '#666', fontSize: 14 }
});