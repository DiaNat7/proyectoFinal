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

export default function OfertaDetailScreen({ route, navigation }) {
  const [oferta, setOferta] = useState(route.params.oferta);
  const BASE_URL = "https://proyectofinal-9evf.onrender.com";

  // ESTADO PARA EL ROL
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    };
    fetchRole();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState(oferta.titulo);
  const [descripcion, setDescripcion] = useState(oferta.descripcion || "");
  const [precioAnterior, setPrecioAnterior] = useState(
    oferta.precioAnterior?.toString() || "",
  );
  const [precioActual, setPrecioActual] = useState(
    oferta.precioActual?.toString() || "",
  );
  const [imagen, setImagen] = useState(oferta.imagen || "");

  const handleAgregarFavorito = async () => {
    if (String(oferta._id).startsWith("ext-")) {
      Alert.alert(
        "Aviso",
        "Esta es una oferta externa. Crea una nueva para probar.",
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/favoritos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ofertaId: oferta._id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Código ${response.status}: ${errorText}`);
      }

      if (Platform.OS === "web") window.alert("Oferta agregada ❤️");
      else Alert.alert("¡Éxito!", "Oferta agregada a tus favoritos ❤️");

      navigation.navigate("Favoritos");
    } catch (error) {
      Alert.alert("Detalle del Error", error.message);
    }
  };

  const handleActualizar = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const datos = {
        titulo,
        descripcion,
        precioAnterior: Number(precioAnterior),
        precioActual: Number(precioActual),
        imagen,
      };

      const response = await fetch(`${BASE_URL}/ofertas/${oferta._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) throw new Error("No se pudo actualizar");

      const dataActualizada = await response.json();
      setOferta(dataActualizada);
      setModalVisible(false);
      Alert.alert("Éxito", "Oferta actualizada");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const ejecutarEliminacion = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}/ofertas/${oferta._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "No se pudo eliminar");
      }

      Alert.alert("Éxito", "Oferta eliminada correctamente");
      navigation.navigate("Inicio");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // --- FUNCIÓN AGREGADA QUE FALTABA ---
  const handleEliminar = () => {
    Alert.alert("¿Eliminar?", "Esta acción no se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", style: "destructive", onPress: ejecutarEliminacion },
    ]);
  };
  // ------------------------------------

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerBanner}>
          <Image
            source={{
              uri: oferta.imagen || "https://via.placeholder.com/400.png",
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{oferta.titulo}</Text>
          <Text style={styles.descText}>
            {oferta.descripcion || "Sin descripción"}
          </Text>

          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio regular:</Text>
              <Text style={styles.precioAnterior}>
                ${oferta.precioAnterior}
              </Text>
            </View>
            <View style={styles.priceRowHighlight}>
              <Text style={styles.priceLabelHighlight}>Precio Ofertin:</Text>
              <Text style={styles.precioActual}>${oferta.precioActual}</Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            {userRole !== "admin" && (
              <TouchableOpacity
                style={styles.btnFavorito}
                onPress={handleAgregarFavorito}
              >
                <Text style={styles.btnFavoritoText}>
                  ❤️ Agregar a Favoritos
                </Text>
              </TouchableOpacity>
            )}

            {userRole === "admin" && (
              <>
                <TouchableOpacity
                  style={styles.btnEditar}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.btnText}>Editar Promoción</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnEliminar}
                  onPress={handleEliminar}
                >
                  <Text style={styles.btnText}>Eliminar Oferta</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.btnVolver}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.btnVolverText}>Volver al Inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Oferta</Text>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={titulo}
              onChangeText={setTitulo}
            />
            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Precio Ant."
                  value={precioAnterior}
                  onChangeText={setPrecioAnterior}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Precio Act."
                  value={precioActual}
                  onChangeText={setPrecioActual}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="URL de Imagen"
              value={imagen}
              onChangeText={setImagen}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnCancelar]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnModal, styles.btnGuardar]}
                onPress={handleActualizar}
              >
                <Text style={styles.btnText}>Guardar</Text>
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
    height: 280,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  image: { width: "100%", height: "100%" },
  content: {
    padding: 25,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  descText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  priceSection: {
    backgroundColor: "#FFF5F5",
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#FFB6C1",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  priceRowHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: { fontSize: 16, color: "#888" },
  priceLabelHighlight: { fontSize: 18, fontWeight: "bold", color: "#E75480" },
  precioAnterior: {
    fontSize: 18,
    color: "#aaa",
    textDecorationLine: "line-through",
  },
  precioActual: { fontSize: 28, fontWeight: "bold", color: "#E75480" },
  buttonsContainer: { gap: 15 },
  btnFavorito: {
    backgroundColor: "#FFB6C1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  btnFavoritoText: { color: "#E75480", fontSize: 16, fontWeight: "bold" },
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
  input: {
    borderWidth: 1,
    borderColor: "#FFB6C1",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  rowInputs: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
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
});