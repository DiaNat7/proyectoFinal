import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function TiendaEditScreen({ route, navigation }) {
  const { tienda } = route.params;

  const [nombre, setNombre] = useState(tienda.nombre);
  const [ubicacion, setUbicacion] = useState(tienda.ubicacion || "");
  const [contacto, setContacto] = useState(tienda.contacto || "");
  const [logo, setLogo] = useState(tienda.logo || "");
  const [loading, setLoading] = useState(false);

  const handleActualizar = async () => {
    if (!nombre) {
      Alert.alert("Error", "El nombre es obligatorio.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/tiendas/${tienda._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          ubicacion,
          contacto,
          logo: logo.trim(),
        }),
      });

      if (!response.ok) throw new Error("Error al actualizar");

      Alert.alert("¡Éxito!", "La tienda se ha actualizado.");
      navigation.navigate("Tiendas");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Editar Tienda</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          value={ubicacion}
          onChangeText={setUbicacion}
        />

        <Text style={styles.label}>Contacto</Text>
        <TextInput
          style={styles.input}
          value={contacto}
          onChangeText={setContacto}
        />

        <Text style={styles.label}>Logo URL</Text>
        <TextInput
          style={styles.input}
          value={logo}
          onChangeText={setLogo}
          autoCapitalize="none"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#E75480" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleActualizar}>
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.btnCancelar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.txtCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5", padding: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E75480",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FFB6C1",
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#E75480",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  btnCancelar: { marginTop: 15, alignItems: "center" },
  txtCancelar: { color: "#666", fontSize: 14 },
});
