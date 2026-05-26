import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, Platform, Modal, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TiendaDetailScreen({ route, navigation }) {
  const [tienda, setTienda] = useState(route.params.tienda);
  const BASE_URL = "https://proyectofinal-9evf.onrender.com";
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    };
    fetchRole();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState(tienda.nombre);
  const [ubicacion, setUbicacion] = useState(tienda.ubicacion || "");
  const [contacto, setContacto] = useState(tienda.contacto || "");
  const [logo, setLogo] = useState(tienda.logo || "");

  const handleActualizar = async () => {
    if (!nombre || !ubicacion) {
      Alert.alert("Error", "Nombre y Ubicación son obligatorios");
      return;
    }
    try {
      const token = await AsyncStorage.getItem("userToken");
      const datos = { nombre, ubicacion, contacto, logo };
      const res = await fetch(`${BASE_URL}/tiendas/${tienda._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error("No se pudo actualizar");
      setTienda(await res.json());
      setModalVisible(false);
      Alert.alert("¡Éxito!", "Tienda actualizada");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const ejecutarEliminacion = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/tiendas/${tienda._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Error al eliminar");
      Alert.alert("Listo", "Tienda eliminada.");
      navigation.navigate("Tiendas");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar");
    }
  };

  const handleEliminar = () => {
    Alert.alert("¿Eliminar?", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí, eliminar", style: "destructive", onPress: ejecutarEliminacion },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerBanner}>
          <Image source={{ uri: tienda.logo || "https://via.placeholder.com/400x200.png" }} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{tienda.nombre}</Text>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>📍 Ubicación: {tienda.ubicacion}</Text>
            <Text style={styles.infoLabel}>📞 Contacto: {tienda.contacto}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            {userRole === "admin" && (
              <>
                <TouchableOpacity style={styles.btnEditar} onPress={() => setModalVisible(true)}><Text style={styles.btnText}>Editar</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnEliminar} onPress={handleEliminar}><Text style={styles.btnText}>Eliminar</Text></TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.btnVolver} onPress={() => navigation.goBack()}><Text style={styles.btnVolverText}>Volver</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  headerBanner: {
    width: "100%",
    height: 280,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  image: { width: "100%", height: "100%" },
  content: {
    padding: 25,
    marginTop: -25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: 500,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  infoSection: {
    backgroundColor: "#F8F9FA",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  infoRow: { marginBottom: 15 },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E75480",
    marginBottom: 4,
  },
  infoValue: { fontSize: 16, color: "#555", lineHeight: 22 },
  buttonsContainer: { gap: 15 },
  btnEditar: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnEliminar: {
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  btnVolver: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnVolverText: { color: "#666", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    elevation: 10,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E75480",
    marginBottom: 20,
    textAlign: "center",
  },
  labelModal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFB6C1",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnModal: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnCancelar: { backgroundColor: "#A9A9A9" },
  btnGuardar: { backgroundColor: "#E75480" },
  textBtn: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
