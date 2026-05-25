import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OfertaDetailScreen({ route, navigation }) {
  const { oferta } = route.params;

  // --- FUNCIÓN PARA AGREGAR A FAVORITOS ---
  const handleAgregarFavorito = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch('http://localhost:3000/favoritos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ofertaId: oferta._id })
      });

      if (!response.ok) throw new Error("No se pudo agregar a favoritos");

      Alert.alert("¡Éxito!", "Oferta agregada a tus favoritos.");
      // Navegamos a Favoritos para que se vea el cambio inmediatamente
      navigation.navigate('Favoritos'); 
    } catch (error) {
      Alert.alert("Error", "No se pudo: " + error.message);
    }
  };

  // --- FUNCIÓN PARA ELIMINAR ---
  const ejecutarEliminacion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/ofertas/${oferta._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("El servidor no pudo eliminar la oferta");

      if (Platform.OS === 'web') window.alert("Eliminado exitosamente.");
      else Alert.alert("Listo", "Eliminado exitosamente.");
      
      navigation.navigate('Inicio');
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar.");
    }
  };

  const handleEliminar = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("¿Eliminar promoción?")) ejecutarEliminacion();
    } else {
      Alert.alert("¿Eliminar?", "Esta acción no se puede deshacer.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, eliminar", style: "destructive", onPress: ejecutarEliminacion }
      ]);
    }
  };

  const handleEditar = () => {
    navigation.navigate('Editar', { oferta });
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: oferta.imagen || "https://via.placeholder.com/400x200.png?text=Sin+Imagen" }} 
        style={styles.image}
        resizeMode="contain"
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{oferta.titulo}</Text>
        
        {oferta.descripcion ? (
          <Text style={styles.descripcion}>{oferta.descripcion}</Text>
        ) : null}

        <View style={styles.priceContainer}>
          <Text style={styles.label}>Precio de lista:</Text>
          <Text style={styles.precioAnterior}>${oferta.precioAnterior}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.label}>Precio con Ofertini:</Text>
          <Text style={styles.precioActual}>${oferta.precioActual}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.btnFavorito} onPress={handleAgregarFavorito}>
            <Text style={styles.btnText}>❤️ Agregar a Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnEditar} onPress={handleEditar}>
            <Text style={styles.btnText}>Editar Promoción</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnEliminar} onPress={handleEliminar}>
            <Text style={styles.btnText}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()}>
            <Text style={styles.btnVolverText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  image: { width: '100%', height: 300, backgroundColor: '#f9f9f9' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  descripcion: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 16, color: '#555', flex: 1 },
  precioAnterior: { fontSize: 18, color: '#aaa', textDecorationLine: 'line-through' },
  precioActual: { fontSize: 26, fontWeight: 'bold', color: '#E75480' },
  buttonsContainer: { marginTop: 40, gap: 15 },
  btnEditar: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnEliminar: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnFavorito: { backgroundColor: '#FF69B4', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  btnVolver: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnVolverText: { color: '#333', fontSize: 16, fontWeight: 'bold' }
});