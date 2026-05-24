import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function TiendasScreen({ navigation }) {
  const [tiendas, setTiendas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetch('http://localhost:3000/tiendas')
        .then(res => res.json())
        .then(data => {
          setTiendas(data.reverse());
          setCargando(false);
        })
        .catch(() => setCargando(false));
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('TiendaDetalle', { tienda: item })}
    >
      <Image 
        source={{ uri: item.logo || "https://via.placeholder.com/400x200.png?text=Tienda" }} 
        style={styles.cardImage}
        resizeMode="contain" 
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        
        {/* CORRECCIÓN: Ahora lee 'ubicacion' de tu base de datos */}
        <Text style={styles.cardDescripcion}>
          {item.ubicacion || 'Sin ubicación registrada'}
        </Text>
        
        <View style={styles.row}>
          <Text style={styles.cardTag}>Ver detalles</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nuestras Tiendas</Text>
      </View>
      
      {cargando ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#E75480" />
          <Text style={styles.loaderText}>Cargando sucursales...</Text>
        </View>
      ) : (
        <FlatList
          data={tiendas}
          keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  header: { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#FFB6C1" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#E75480" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 15, color: "#666", fontSize: 16 },
  listContainer: { padding: 20, alignItems: 'center' },
  card: { backgroundColor: "#fff", borderRadius: 15, borderWidth: 1, borderColor: "#FFB6C1", width: '100%', maxWidth: 450, overflow: 'hidden', elevation: 3 },
  cardImage: { width: "100%", height: 200, backgroundColor: "#fff" },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 5 },
  cardDescripcion: { fontSize: 14, color: "#888", marginBottom: 15, fontStyle: 'italic' },
  row: { flexDirection: "row", justifyContent: "flex-end" },
  cardTag: { fontSize: 12, color: "#E75480", backgroundColor: "#ffe4e1", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, fontWeight: "bold" },
});