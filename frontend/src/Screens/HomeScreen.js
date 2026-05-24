import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { ofertasService } from "../Services/api";

export default function HomeScreen({ navigation, setUserToken }) {
  const [ofertas, setOfertas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cargarOfertasBackend();
    }, [])
  );

  const cargarOfertasBackend = async () => {
    try {
      setCargando(true);
      const datosReales = await ofertasService.getAll();
      setOfertas(datosReales.reverse());
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
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      // Llamamos a la ruta 'Detalle' registrada en tu mapa
      onPress={() => navigation.navigate('Detalle', { oferta: item })}
    >
      <Image 
        source={{ uri: item.imagen || "https://via.placeholder.com/400.png?text=Oferta+Sin+Imagen" }} 
        style={styles.cardImage}
        resizeMode="contain" 
      />
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.titulo}</Text>
        
        {item.descripcion ? (
          <Text style={styles.cardDescripcion} numberOfLines={1}>{item.descripcion}</Text>
        ) : null}

        <View style={styles.row}>
          <View style={styles.preciosCol}>
            <Text style={styles.precioAnterior}>${item.precioAnterior}</Text>
            <Text style={styles.cardPrecio}>${item.precioActual}</Text>
          </View>
          <Text style={styles.cardTag}>Ver detalles</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ofertini</Text>
        <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {cargando ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E75480" />
          <Text style={styles.loaderText}>Actualizando catálogo...</Text>
        </View>
      ) : ofertas.length === 0 ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>No hay ofertas disponibles. ¡Crea la primera!</Text>
        </View>
      ) : (
        <FlatList
          data={ofertas}
          keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#FFB6C1", elevation: 4 },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#E75480" },
  logoutButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#ffe4e1", borderRadius: 8 },
  logoutText: { color: "#E75480", fontWeight: "bold" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 15, color: "#666", fontSize: 16 },
  
  listContainer: { 
    padding: 20,
    alignItems: 'center' // Centra los elementos de la lista
  },
  
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFB6C1",
    overflow: "hidden", 
    elevation: 3,
    width: '100%',
    maxWidth: 450,
  },
  cardImage: { width: "100%", height: 200, backgroundColor: "#fff" },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#333", lineHeight: 24, marginBottom: 5 },
  cardDescripcion: { fontSize: 14, color: "#888", marginBottom: 15, fontStyle: 'italic' },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  preciosCol: { flexDirection: 'column', alignItems: 'flex-start' },
  precioAnterior: { fontSize: 14, color: "#aaa", textDecorationLine: "line-through", marginBottom: -2 },
  cardPrecio: { fontSize: 26, fontWeight: "bold", color: "#E75480", lineHeight: 28 },
  cardTag: { fontSize: 12, color: "#E75480", backgroundColor: "#ffe4e1", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, fontWeight: "bold", overflow: "hidden" },
});