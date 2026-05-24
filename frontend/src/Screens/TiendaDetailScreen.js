import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';

export default function TiendaDetailScreen({ route, navigation }) {
  const { tienda } = route.params;

  // Función interna para conectar con la API de borrado
  const ejecutarEliminacion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tiendas/${tienda._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("El servidor no pudo eliminar la tienda");
      }

      // Alerta de éxito según la plataforma
      if (Platform.OS === 'web') {
        window.alert("La tienda fue eliminada exitosamente.");
      } else {
        Alert.alert("Listo", "La tienda fue eliminada exitosamente.");
      }
      
      // Redireccionamos al directorio de tiendas
      navigation.navigate('Tiendas'); 
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') {
        window.alert("Error al eliminar: " + error.message);
      } else {
        Alert.alert("Error", "No se pudo eliminar: " + error.message);
      }
    }
  };

  // LÓGICA DE CONFIRMACIÓN DE BORRADO
  const handleEliminar = () => {
    if (Platform.OS === 'web') {
      // Confirmación nativa del navegador para desarrollo web
      const seguro = window.confirm("¿Estás seguro de que deseas eliminar esta tienda? Esta acción no se puede deshacer.");
      if (seguro) {
        ejecutarEliminacion();
      }
    } else {
      // Confirmación flotante tradicional para iOS/Android
      Alert.alert(
        "¿Eliminar Tienda?",
        "Esta acción no se puede deshacer y se borrará de la base de datos.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sí, eliminar", style: "destructive", onPress: ejecutarEliminacion }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: tienda.logo || "https://via.placeholder.com/400x200.png?text=Sin+Logo" }} 
        style={styles.image}
        resizeMode="contain"
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{tienda.nombre}</Text>
        
        {/* Atributo ubicación corregido */}
        {tienda.ubicacion ? (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ubicación:</Text>
            <Text style={styles.infoText}>{tienda.ubicacion}</Text>
          </View>
        ) : null}

        {/* Atributo contacto agregado */}
        {tienda.contacto ? (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Contacto:</Text>
            <Text style={styles.infoText}>{tienda.contacto}</Text>
          </View>
        ) : null}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.btnEditar} 
            onPress={() => navigation.navigate('TiendaEditar', { tienda })}
          >
            <Text style={styles.btnText}>Editar Tienda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnEliminar} onPress={handleEliminar}>
            <Text style={styles.btnText}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()}>
            <Text style={styles.btnVolverText}>Volver al Directorio</Text>
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', width: 100 },
  infoText: { fontSize: 16, color: '#666', flex: 1 },
  buttonsContainer: { marginTop: 40, gap: 15 },
  btnEditar: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnEliminar: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  btnVolver: { backgroundColor: '#E0E0E0', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnVolverText: { color: '#333', fontSize: 16, fontWeight: 'bold' }
});