import React from 'react';
// 1. IMPORTAMOS Platform
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';

export default function OfertaDetailScreen({ route, navigation }) {
  const { oferta } = route.params;

  // Separamos la lógica de borrado real para no repetir código
  const ejecutarEliminacion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/ofertas/${oferta._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("El servidor no pudo eliminar la oferta");
      }

      // Mostramos el éxito dependiendo de la plataforma
      if (Platform.OS === 'web') {
        window.alert("La oferta fue eliminada exitosamente.");
      } else {
        Alert.alert("Listo", "La oferta fue eliminada exitosamente.");
      }
      
      navigation.navigate('Inicio'); // Forzamos el regreso al Home
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') {
        window.alert("Error al eliminar: " + error.message);
      } else {
        Alert.alert("Error", "No se pudo eliminar: " + error.message);
      }
    }
  };

  // --- FUNCIÓN PARA ELIMINAR (MULTI-PLATAFORMA) ---
  const handleEliminar = () => {
    if (Platform.OS === 'web') {
      // Confirmación especial para navegadores web
      const seguro = window.confirm("¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer.");
      if (seguro) {
        ejecutarEliminacion();
      }
    } else {
      // Confirmación nativa para celulares iOS/Android
      Alert.alert(
        "¿Eliminar Promoción?",
        "Esta acción no se puede deshacer y se borrará de la base de datos.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sí, eliminar", style: "destructive", onPress: ejecutarEliminacion }
        ]
      );
    }
  };

  const handleEditar = () => {
    navigation.navigate('Editar', { oferta });
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: oferta.imagen || "https://via.placeholder.com/400x200.png?text=Oferta+Sin+Imagen" }} 
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
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  btnVolver: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnVolverText: { color: '#333', fontSize: 16, fontWeight: 'bold' }
});