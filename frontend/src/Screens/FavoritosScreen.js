import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const BASE_URL = 'https://proyectofinal-9evf.onrender.com';

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const getHeaders = async () => {
    const token = await AsyncStorage.getItem("userToken");
    return { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setCargando(true);
      
      getHeaders().then(headers => {
        fetch(`${BASE_URL}/favoritos`, { headers })
          .then(res => res.json())
          .then(data => {
            if (isMounted) {
              setFavoritos(Array.isArray(data) ? data.reverse() : []);
              setCargando(false);
            }
          })
          .catch(err => {
            console.error("Error al conectar:", err);
            if (isMounted) setCargando(false);
          });
      });
      return () => { isMounted = false; };
    }, [])
  );

  const handleQuitarFavorito = (idFavorito) => {
    getHeaders().then(headers => {
      fetch(`${BASE_URL}/favoritos/${idFavorito}`, { method: 'DELETE', headers })
        .then(res => {
          if (res.ok) {
            Alert.alert("Listo", "Eliminado");
            navigation.navigate('Inicio'); 
            setTimeout(() => navigation.navigate('Favoritos'), 100);
          }
        })
        .catch(() => Alert.alert("Error", "No se pudo quitar"));
    });
  };

  const renderItem = ({ item }) => {
    const oferta = item.oferta || {};
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalle', { oferta: oferta })}>
        <Image source={{ uri: oferta.imagen || "https://via.placeholder.com/400.png" }} style={styles.cardImage} resizeMode="contain" />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{oferta.titulo || "Sin título"}</Text>
          <View style={styles.row}>
            <Text style={styles.cardPrecio}>${oferta.precioActual || "0"}</Text>
            <TouchableOpacity style={styles.btnQuitar} onPress={() => handleQuitarFavorito(item._id)}>
              <Text style={styles.btnQuitarText}>Quitar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Favoritos</Text></View>
      {cargando ? (
        <ActivityIndicator size="large" color="#E75480" style={{marginTop: 50}}/>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#FFB6C1" },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#E75480" },
  listContainer: { padding: 20, alignItems: 'center' },
  card: { backgroundColor: "#fff", borderRadius: 15, borderWidth: 1, borderColor: "#FFB6C1", elevation: 3, width: '100%', maxWidth: 450, marginBottom: 20 },
  cardImage: { width: "100%", height: 200 },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardPrecio: { fontSize: 22, fontWeight: "bold", color: "#E75480" },
  btnQuitar: { backgroundColor: "#ffe4e1", padding: 10, borderRadius: 15 },
  btnQuitarText: { color: "#E75480", fontWeight: "bold" }
});