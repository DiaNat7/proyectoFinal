import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ofertasService } from "../Services/api";

export default function HomeScreen({ setUserToken }) {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarOfertasBackend();
  }, []);

  const cargarOfertasBackend = async () => {
    try {
      setCargando(true);
      // Usamos tu método exacto del api.js
      const datosReales = await ofertasService.getAll();

      setOfertas(datosReales);
    } catch (error) {
      Alert.alert("Error de conexión", error.message);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("userToken");
    setUserToken(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardTienda}>{item.tienda}</Text>
      <View style={styles.row}>
        <Text style={styles.cardPrecio}>${item.precio}</Text>
        <Text style={styles.cardExpiracion}>Vence: {item.expiracion}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OfertasYa</Text>
        <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E75480" />
          <Text style={styles.loaderText}>Cargando datos del servidor...</Text>
        </View>
      ) : ofertas.length === 0 ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>
            No hay ofertas disponibles en este momento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={ofertas}
          keyExtractor={(item) =>
            item._id ? item._id.toString() : Math.random().toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#E75480" },
  logoutButton: { padding: 8, backgroundColor: "#ffe4e1", borderRadius: 8 },
  logoutText: { color: "#E75480", fontWeight: "bold" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 15, color: "#666", fontSize: 16 },
  listContainer: { padding: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFB6C1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardTienda: { fontSize: 14, color: "#888", marginBottom: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrecio: { fontSize: 20, fontWeight: "bold", color: "#E75480" },
  cardExpiracion: {
    fontSize: 12,
    color: "#E75480",
    backgroundColor: "#ffe4e1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
  },
});
