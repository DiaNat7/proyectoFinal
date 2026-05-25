import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const BASE_URL = 'https://proyectofinal-9evf.onrender.com';

export default function CategoriasScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para el Modal de Crear Nueva
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("");
  const [color, setColor] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // OBTENER TODAS
  const cargarCategorias = () => {
    setCargando(true);
    fetch(`${BASE_URL}/categorias`)
      .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then(data => {
        setCategorias(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al conectar:", err);
        if (Platform.OS !== 'web') Alert.alert("Error", "No se pudieron cargar las categorías.");
        setCargando(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      cargarCategorias();
    }, [])
  );

  // GUARDAR NUEVA
  const handleGuardar = () => {
    if (!nombre) {
      if (Platform.OS === 'web') window.alert("El nombre de la categoría es obligatorio");
      else Alert.alert("Error", "El nombre de la categoría es obligatorio");
      return;
    }

    const datos = { nombre, icono, color, descripcion };

    fetch(`${BASE_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        if (Platform.OS === 'web') window.alert("Categoría creada");
        else Alert.alert("¡Éxito!", "Categoría creada");
        
        setModalVisible(false);
        limpiarFormulario();
        cargarCategorias(); 
      })
      .catch((err) => {
        console.log("Error detallado al guardar:", err);
        if (Platform.OS === 'web') window.alert("No se pudo procesar la solicitud");
        else Alert.alert("Error", "No se pudo procesar la solicitud");
      });
  };

  const limpiarFormulario = () => {
    setNombre("");
    setIcono("");
    setColor("");
    setDescripcion("");
  };

  const renderItem = ({ item }) => {
    const colorValido = (item.color && item.color.startsWith('#')) ? item.color : "#E75480";
    
    return (
      // AHORA AL TOCAR LA TARJETA, VIAJAMOS A LA PANTALLA DE DETALLES
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colorValido }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CategoriaDetalle', { categoria: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{item.icono || "🏷️"}</Text>
        </View>

        <Text style={styles.cardTitle}>{item.nombre}</Text>
        {item.descripcion ? (
          <Text style={styles.cardDesc} numberOfLines={2}>{item.descripcion}</Text>
        ) : null}
        
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categorías</Text>
        <TouchableOpacity 
          style={styles.btnAgregar} 
          onPress={() => { limpiarFormulario(); setModalVisible(true); }}
        >
          <Text style={styles.btnAgregarText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <ActivityIndicator size="large" color="#E75480" style={{ marginTop: 50 }} />
      ) : categorias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay categorías. ¡Agrega la primera!</Text>
        </View>
      ) : (
        <FlatList
          data={categorias}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* MODAL SOLO PARA CREAR */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Categoría</Text>
            
            <Text style={styles.label}>Nombre de la categoría:</Text>
            <TextInput style={styles.input} placeholder="Ej: Electrónica" value={nombre} onChangeText={setNombre} />
            
            <Text style={styles.label}>Ícono (Usa un Emoji):</Text>
            <TextInput style={styles.input} placeholder="Ej: 📱" value={icono} onChangeText={setIcono} />
            
            <Text style={styles.label}>Color de la tarjeta (Hexadecimal):</Text>
            <TextInput style={styles.input} placeholder="Ej: #4A90E2" value={color} onChangeText={setColor} />
            
            <Text style={styles.label}>Descripción breve:</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Opcional..." value={descripcion} onChangeText={setDescripcion} multiline />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btnModal, styles.btnCancelar]} onPress={() => setModalVisible(false)}>
                <Text style={styles.textBtn}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnModal, styles.btnGuardar]} onPress={handleGuardar}>
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
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#FFB6C1", elevation: 4 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#E75480" },
  btnAgregar: { backgroundColor: "#E75480", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  btnAgregarText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 16 },
  listContainer: { padding: 20 },
  
  card: { padding: 20, borderRadius: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: 10 },
  cardIcon: { fontSize: 45 },
  cardTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  cardDesc: { fontSize: 14, color: "#fff", opacity: 0.9, marginTop: 5 },
  hintText: { fontSize: 12, fontWeight: 'bold', color: "#fff", opacity: 0.9, marginTop: 15, textAlign: "right" },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 25, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#E75480', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 5, marginLeft: 5 },
  input: { borderWidth: 1, borderColor: '#FFB6C1', padding: 12, borderRadius: 10, marginBottom: 15, backgroundColor: '#FFF' },
  textArea: { minHeight: 60, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnModal: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  btnCancelar: { backgroundColor: '#A9A9A9' },
  btnGuardar: { backgroundColor: '#E75480' },
  textBtn: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});