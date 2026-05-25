import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Platform, Modal, TextInput } from 'react-native';

export default function TiendaDetailScreen({ route, navigation }) {
  // Estado local para la tienda para que la vista se actualice al editar
  const [tienda, setTienda] = useState(route.params.tienda);
  
  const BASE_URL = 'https://proyectofinal-9evf.onrender.com';

  // ESTADOS PARA EL MODAL DE EDICIÓN 
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState(tienda.nombre);
  const [ubicacion, setUbicacion] = useState(tienda.ubicacion || "");
  const [contacto, setContacto] = useState(tienda.contacto || "");
  const [logo, setLogo] = useState(tienda.logo || "");

  // FUNCIÓN PARA ACTUALIZAR 
  const handleActualizar = async () => {
    if (!nombre || !ubicacion) {
      if (Platform.OS === 'web') window.alert("Nombre y Ubicación son obligatorios");
      else Alert.alert("Error", "Nombre y Ubicación son obligatorios");
      return;
    }

    try {
      const datos = { nombre, ubicacion, contacto, logo };
      const res = await fetch(`${BASE_URL}/tiendas/${tienda._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      if (!res.ok) throw new Error("No se pudo actualizar la tienda");

      const dataActualizada = await res.json();
      
      // Actualizamos el estado local y cerramos modal
      setTienda(dataActualizada);
      setModalVisible(false);

      if (Platform.OS === 'web') window.alert("Tienda actualizada correctamente");
      else Alert.alert("¡Éxito!", "Tienda actualizada correctamente");
      
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') window.alert("Error: " + error.message);
      else Alert.alert("Error", error.message);
    }
  };

  //  FUNCIÓN PARA ELIMINAR 
  const ejecutarEliminacion = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tiendas/${tienda._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Error al eliminar");

      if (Platform.OS === 'web') window.alert("Tienda eliminada exitosamente.");
      else Alert.alert("Listo", "Tienda eliminada exitosamente.");
      
      navigation.navigate('Tiendas'); 
    } catch (error) {
      if (Platform.OS === 'web') window.alert("No se pudo eliminar");
      else Alert.alert("Error", "No se pudo eliminar");
    }
  };

  const handleEliminar = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("¿Estás seguro de eliminar esta tienda?")) ejecutarEliminacion();
    } else {
      Alert.alert("¿Eliminar?", "Esta acción no se puede deshacer.", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, eliminar", style: "destructive", onPress: ejecutarEliminacion }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Banner del Logo */}
        <View style={styles.headerBanner}>
          <Image 
            source={{ uri: tienda.logo || "https://via.placeholder.com/400x200.png?text=Sin+Logo" }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        {/* Contenido con efecto de superposición */}
        <View style={styles.content}>
          <Text style={styles.title}>{tienda.nombre}</Text>
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Ubicación:</Text>
              <Text style={styles.infoValue}>{tienda.ubicacion || "No registrada"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📞 Contacto:</Text>
              <Text style={styles.infoValue}>{tienda.contacto || "No registrado"}</Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.btnEditar} onPress={() => setModalVisible(true)}>
              <Text style={styles.btnText}>Editar Tienda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnEliminar} onPress={handleEliminar}>
              <Text style={styles.btnText}>Eliminar Tienda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()}>
              <Text style={styles.btnVolverText}>Volver al Directorio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* MODAL EMERGENTE DE EDICIÓN */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Tienda</Text>
            
            <Text style={styles.labelModal}>Nombre de la tienda:</Text>
            <TextInput style={styles.input} placeholder="Ej: Amazon" value={nombre} onChangeText={setNombre} />
            
            <Text style={styles.labelModal}>Ubicación:</Text>
            <TextInput style={styles.input} placeholder="Dirección..." value={ubicacion} onChangeText={setUbicacion} />
            
            <Text style={styles.labelModal}>Contacto (Tel/Email):</Text>
            <TextInput style={styles.input} placeholder="Ej: 476 123 4567" value={contacto} onChangeText={setContacto} />
            
            <Text style={styles.labelModal}>URL del Logo:</Text>
            <TextInput style={styles.input} placeholder="http://..." value={logo} onChangeText={setLogo} />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btnModal, styles.btnCancelar]} onPress={() => setModalVisible(false)}>
                <Text style={styles.textBtn}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnModal, styles.btnGuardar]} onPress={handleActualizar}>
                <Text style={styles.textBtn}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerBanner: { width: '100%', height: 280, backgroundColor: '#f9f9f9', elevation: 2 },
  image: { width: '100%', height: '100%' },
  content: { padding: 25, marginTop: -25, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 500 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
  
  infoSection: { backgroundColor: '#F8F9FA', padding: 20, borderRadius: 20, marginBottom: 30 },
  infoRow: { marginBottom: 15 },
  infoLabel: { fontSize: 16, fontWeight: 'bold', color: '#E75480', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#555', lineHeight: 22 },

  buttonsContainer: { gap: 15 },
  btnEditar: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnEliminar: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  btnVolver: { backgroundColor: '#F0F0F0', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnVolverText: { color: '#666', fontSize: 16, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 25, padding: 25, elevation: 10, width: '100%', maxWidth: 500, alignSelf: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#E75480', marginBottom: 20, textAlign: 'center' },
  labelModal: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5, marginLeft: 5 },
  input: { borderWidth: 1, borderColor: '#FFB6C1', padding: 12, borderRadius: 12, marginBottom: 15, backgroundColor: '#FFF' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnModal: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center', marginHorizontal: 5 },
  btnCancelar: { backgroundColor: '#A9A9A9' },
  btnGuardar: { backgroundColor: '#E75480' }
});