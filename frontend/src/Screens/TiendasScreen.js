import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://proyectofinal-9evf.onrender.com";

export default function TiendasScreen({ navigation }) {
  const [tiendas, setTiendas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- LECTURA DEL ROL ---
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    };
    fetchRole();
  }, []);

  // ESTADOS PARA EL MODAL DE NUEVA TIENDA
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [contacto, setContacto] = useState("");
  const [logo, setLogo] = useState("");

  useFocusEffect(
    useCallback(() => {
      cargarTiendasBackend();
    }, []),
  );

  const cargarTiendasBackend = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${BASE_URL}/tiendas`);
      if (!res.ok) throw new Error("Error al cargar tiendas");
      const data = await res.json();
      setTiendas(Array.isArray(data) ? data.reverse() : []);
    } catch (error) {
      console.error("Error al conectar:", error);
      if (Platform.OS !== "web")
        Alert.alert("Error de conexión", "No se pudieron cargar las tiendas.");
    } finally {
      setCargando(false);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setUbicacion("");
    setContacto("");
    setLogo("");
  };

  // GUARDAR NUEVA TIENDA (Actualizado para enviar token)
  const handleGuardarTienda = async () => {
    if (!nombre || !ubicacion) {
      if (Platform.OS === "web")
        window.alert("El nombre y la ubicación son obligatorios");
      else Alert.alert("Error", "El nombre y la ubicación son obligatorios");
      return;
    }

    try {
      const nuevaTienda = { nombre, ubicacion, contacto, logo };
      const token = await AsyncStorage.getItem("userToken");

      const res = await fetch(`${BASE_URL}/tiendas`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <-- Token necesario para crear
        },
        body: JSON.stringify(nuevaTienda),
      });

      if (!res.ok) throw new Error("No se pudo guardar la tienda");

      if (Platform.OS === "web") window.alert("Tienda creada con éxito");
      else Alert.alert("¡Éxito!", "Tienda creada con éxito");

      setModalVisible(false);
      limpiarFormulario();
      cargarTiendasBackend(); 
    } catch (error) {
      console.error("Error al guardar tienda:", error);
      if (Platform.OS === "web") window.alert("Ocurrió un error al guardar");
      else Alert.alert("Error", "Ocurrió un error al guardar");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("TiendaDetalle", { tienda: item })}
    >
      <Image
        source={{
          uri:
            item.logo || "https://via.placeholder.com/400x200.png?text=Tienda",
        }}
        style={styles.cardImage}
        resizeMode="contain"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>

        <Text style={styles.cardDescripcion}>
          📍 {item.ubicacion || "Sin ubicación registrada"}
        </Text>

        {item.contacto ? (
          <Text style={styles.cardContacto}>📞 {item.contacto}</Text>
        ) : null}

        <View style={styles.row}>
          <Text style={styles.cardTag}>Ver detalles</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tiendas</Text>

        {/* CONDICIONAL: Solo admins ven el botón de Agregar */}
        {userRole === 'admin' && (
          <TouchableOpacity
            style={styles.btnAgregar}
            onPress={() => {
              limpiarFormulario();
              setModalVisible(true);
            }}
          >
            <Text style={styles.btnAgregarText}>+ Nueva</Text>
          </TouchableOpacity>
        )}
      </View>

      {cargando ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E75480" />
          <Text style={styles.loaderText}>Cargando sucursales...</Text>
        </View>
      ) : tiendas.length === 0 ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>
            No hay tiendas registradas. ¡Agrega la primera!
          </Text>
        </View>
      ) : (
        <FlatList
          data={tiendas}
          keyExtractor={(item) =>
            item._id ? item._id.toString() : Math.random().toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}

      {/* FORMULARIO MODAL PARA NUEVA TIENDA */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Tienda</Text>

            <Text style={styles.label}>Nombre de la tienda:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Sucursal Centro"
              value={nombre}
              onChangeText={setNombre}
            />

            <Text style={styles.label}>Ubicación/Dirección:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Av. Principal 123"
              value={ubicacion}
              onChangeText={setUbicacion}
            />

            <Text style={styles.label}>Contacto (Teléfono / Email):</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 476 123 4567"
              value={contacto}
              onChangeText={setContacto}
            />

            <Text style={styles.label}>URL del Logo (Opcional):</Text>
            <TextInput
              style={styles.input}
              placeholder="http://..."
              value={logo}
              onChangeText={setLogo}
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
                onPress={handleGuardarTienda}
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
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#FFB6C1",
    elevation: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#E75480" },
  btnAgregar: {
    backgroundColor: "#E75480",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnAgregarText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 15, color: "#666", fontSize: 16 },
  listContainer: { padding: 20, alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFB6C1",
    width: "100%",
    maxWidth: 450,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: { width: "100%", height: 200, backgroundColor: "#fff" },
  cardContent: { padding: 15 },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardDescripcion: { fontSize: 14, color: "#666", marginBottom: 5 },
  cardContacto: {
    fontSize: 14,
    color: "#E75480",
    fontWeight: "600",
    marginBottom: 15,
  },
  row: { flexDirection: "row", justifyContent: "flex-end" },
  cardTag: {
    fontSize: 12,
    color: "#E75480",
    backgroundColor: "#ffe4e1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontWeight: "bold",
  },
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
  textBtn: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});