import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function CategoriesDetailScreen({ route, navigation }) {
  const [categoria, setCategoria] = useState(route.params.categoria);
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
  const [nombre, setNombre] = useState(categoria.nombre);
  const [icono, setIcono] = useState(categoria.icono || "");
  const [color, setColor] = useState(categoria.color || "");
  const [descripcion, setDescripcion] = useState(categoria.descripcion || "");

  // Función corregida que faltaba
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
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) throw new Error("No se pudo actualizar");
      setCategoria(await res.json());
      setModalVisible(false);
      Alert.alert("¡Éxito!", "Categoría actualizada");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const ejecutarEliminacion = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/categorias/${categoria._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("No se pudo eliminar");
      Alert.alert("Listo", "Categoría eliminada.");
      navigation.navigate("Categorías");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={[styles.headerBanner, { backgroundColor: bgColor }]}>
          <Text style={styles.iconoGigante}>{categoria.icono || "🏷️"}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{categoria.nombre}</Text>

          {categoria.descripcion ? (
            <Text style={styles.descText}>{categoria.descripcion}</Text>
          ) : (
            <Text style={styles.descText}>Sin descripción registrada.</Text>
          )}

          <View style={styles.buttonsContainer}>
            {/* Solo admin ve esto */}
            {userRole === "admin" && (
              <>
                <TouchableOpacity
                  style={styles.btnEditar}
                  onPress={abrirModalEditar}
                >
                  <Text style={styles.btnText}>Editar Categoría</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnEliminar}
                  onPress={handleEliminar}
                >
                  <Text style={styles.btnText}>Eliminar Categoría</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Lo ven todos */}
            <TouchableOpacity
              style={styles.btnVolver}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.btnVolverText}>Volver al Directorio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Categoría</Text>

            <Text style={styles.label}>Nombre de la categoría:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Electrónica"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Ícono (Usa un Emoji):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 📱"
              value={icono}
              onChangeText={setIcono}
            />

            <Text style={styles.label}>Color de la tarjeta (Hexadecimal):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: #4A90E2"
              value={color}
              onChangeText={setColor}
            />

            <Text style={styles.label}>Descripción breve:</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Opcional..."
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnCancelar]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textBtn}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnGuardar]}
                onPress={handleActualizar}
              >
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
