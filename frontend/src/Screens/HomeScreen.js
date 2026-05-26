import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Modal,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { ofertasService } from "../Services/api";

const BASE_URL = "https://proyectofinal-9evf.onrender.com";

export default function HomeScreen({ route, navigation, setUserToken }) {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- NUEVO: Estado y lectura del rol ---
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    };
    fetchRole();
  }, []);
  // ---------------------------------------

  // Estados para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioAnterior, setPrecioAnterior] = useState("");
  const [precioActual, setPrecioActual] = useState("");
  const [imagen, setImagen] = useState("");

  useFocusEffect(
    useCallback(() => {
      cargarOfertasBackend();
    }, []),
  );

  const cargarOfertasBackend = async () => {
    try {
      setCargando(true);
      setOfertas([]);
      
      const [datosLocales, resExterna] = await Promise.all([
        ofertasService.getAll().catch(() => []),
        fetch("https://dummyjson.com/products?limit=30").catch(() => ({
          json: () => ({ products: [] }),
        })),
      ]);

      const datosExterna = await resExterna.json();
      const ofertasExternas = (datosExterna.products || []).map((item) => ({
        _id: "ext-" + item.id,
        titulo: item.title,
        descripcion: item.description,
        precioActual: item.price,
        imagen: item.thumbnail,
        precioAnterior: (item.price * 1.2).toFixed(2),
        createdAt: new Date().toISOString(),
      }));

      const locales = Array.isArray(datosLocales) ? datosLocales.reverse() : [];
      setOfertas([...locales, ...ofertasExternas]);
    } catch (error) {
      console.error("Error cargando ofertas:", error);
      if (Platform.OS !== "web")
        Alert.alert("Error", "No se pudieron cargar las ofertas");
    } finally {
      setCargando(false);
    }
  };

  // FUNCIÓN DE CERRAR SESIÓN
  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      const logout = setUserToken || route.params?.setUserToken;

      if (logout) {
        logout(null);
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleGuardarOferta = async () => {
    if (!titulo || !precioActual)
      return Alert.alert("Error", "Título y precio son obligatorios");

    try {
      const token = await AsyncStorage.getItem("userToken");
      await fetch(`${BASE_URL}/ofertas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          precioAnterior,
          precioActual,
          imagen,
        }),
      });
      setModalVisible(false);
      setTitulo("");
      setDescripcion("");
      setPrecioAnterior("");
      setPrecioActual("");
      setImagen("");
      cargarOfertasBackend();
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la oferta");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("Detalle", { oferta: item })}
    >
      <Image
        source={{ uri: item.imagen || "https://via.placeholder.com/400.png" }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.titulo || "Oferta sin título"}
        </Text>
        <Text style={styles.cardDescripcion} numberOfLines={2}>
          {item.descripcion || "Sin descripción disponible"}
        </Text>

        <View style={styles.priceRow}>
          {item.precioAnterior ? (
            <Text style={styles.precioAnterior}>${item.precioAnterior}</Text>
          ) : null}
          <Text style={styles.cardPrecio}>${item.precioActual || "0.00"}</Text>
        </View>

        {item.createdAt && (
          <Text style={styles.dateText}>
            Creado: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ofertin</Text>
        <View style={styles.headerButtons}>
          
          {/* RENDERIZADO CONDICIONAL: Solo el administrador ve el botón de agregar */}
          {userRole === 'admin' && (
            <TouchableOpacity
              style={styles.btnAgregar}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.btnAgregarText}>+ Nueva</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={ofertas}
        keyExtractor={(item) =>
          item._id ? item._id.toString() : Math.random().toString()
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Crear Nueva Oferta</Text>
            <TextInput
              style={styles.input}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Título de oferta"
            />
            <TextInput
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción"
              multiline
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TextInput
                style={[styles.input, { width: "48%" }]}
                value={precioAnterior}
                onChangeText={setPrecioAnterior}
                placeholder="Precio Ant."
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { width: "48%" }]}
                value={precioActual}
                onChangeText={setPrecioActual}
                placeholder="Precio Act."
                keyboardType="numeric"
              />
            </View>
            <TextInput
              style={styles.input}
              value={imagen}
              onChangeText={setImagen}
              placeholder="URL Imagen"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnGuardar}
                onPress={handleGuardarOferta}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
    elevation: 4,
  },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#E75480" },
  headerButtons: { flexDirection: "row", alignItems: "center" },
  btnAgregar: {
    backgroundColor: "#E75480",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnAgregarText: { color: "#fff", fontWeight: "bold" },
  logoutButton: {
    padding: 10,
    backgroundColor: "#ffe4e1",
    borderRadius: 12,
    marginLeft: 10,
  },
  logoutText: { color: "#E75480", fontWeight: "bold" },
  listContainer: { padding: 15, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    width: "100%",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    backgroundColor: "#eee",
  },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 19, fontWeight: "bold", color: "#333" },
  cardDescripcion: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  precioAnterior: {
    fontSize: 14,
    color: "#aaa",
    textDecorationLine: "line-through",
  },
  cardPrecio: { fontSize: 20, fontWeight: "bold", color: "#E75480" },
  dateText: { fontSize: 11, color: "#999", marginTop: 10, fontStyle: "italic" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#E75480",
  },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fdfdfd",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnCancelar: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 15,
    flex: 0.45,
    alignItems: "center",
  },
  btnGuardar: {
    padding: 15,
    backgroundColor: "#E75480",
    borderRadius: 15,
    flex: 0.45,
    alignItems: "center",
  },
});