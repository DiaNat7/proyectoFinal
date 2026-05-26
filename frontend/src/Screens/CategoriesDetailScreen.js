import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, Modal, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CategoriesDetailScreen({ route, navigation }) {
  const [categoria, setCategoria] = useState(route.params.categoria);
  const BASE_URL = "https://proyectofinal-9evf.onrender.com";
  
  // CORRECCIÓN: Definir bgColor antes del return para evitar ReferenceError
  const bgColor = categoria.color && categoria.color.startsWith("#") ? categoria.color : "#E75480";
  
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    };
    fetchRole();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState(categoria.nombre);
  const [icono, setIcono] = useState(categoria.icono || "");
  const [color, setColor] = useState(categoria.color || "");
  const [descripcion, setDescripcion] = useState(categoria.descripcion || "");

  // CORRECCIÓN: Definir función para abrir modal
  const abrirModalEditar = () => {
    setNombre(categoria.nombre);
    setIcono(categoria.icono || "");
    setColor(categoria.color || "");
    setDescripcion(categoria.descripcion || "");
    setModalVisible(true);
  };

  const handleActualizar = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const datos = { nombre, icono, color, descripcion };
      const res = await fetch(`${BASE_URL}/categorias/${categoria._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error("No se pudo actualizar");
      setCategoria(await res.json());
      setModalVisible(false);
      Alert.alert("¡Éxito!", "Actualizado");
    } catch (error) { Alert.alert("Error", error.message); }
  };

  const ejecutarEliminacion = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${BASE_URL}/categorias/${categoria._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      navigation.navigate("Categorías");
    } catch (error) { Alert.alert("Error", error.message); }
  };

  // CORRECCIÓN: Definir función de eliminar
  const handleEliminar = () => {
    Alert.alert("¿Eliminar?", "¿Estás segura?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: ejecutarEliminacion },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={[styles.headerBanner, { backgroundColor: bgColor }]}>
          <Text style={styles.iconoGigante}>{categoria.icono || "🏷️"}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{categoria.nombre}</Text>
          {userRole === "admin" && (
            <>
              <TouchableOpacity style={styles.btnEditar} onPress={abrirModalEditar}><Text style={styles.btnText}>Editar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnEliminar} onPress={handleEliminar}><Text style={styles.btnText}>Eliminar</Text></TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()}><Text style={styles.btnVolverText}>Volver</Text></TouchableOpacity>
        </View>
      </ScrollView>
      {/* (Mantén tu Modal de edición original aquí) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  headerBanner: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  iconoGigante: { fontSize: 100 },
  content: {
    padding: 25,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  descText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 26,
  },
  buttonsContainer: { gap: 15 },
  btnEditar: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnEliminar: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  btnVolver: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnVolverText: { color: "#333", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E75480",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFB6C1",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  textArea: { minHeight: 60, textAlignVertical: "top" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnModal: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnCancelar: { backgroundColor: "#A9A9A9" },
  btnGuardar: { backgroundColor: "#E75480" },
  textBtn: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
