import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../Services/api";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validaciones de seguridad
    if (!nombre || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      Alert.alert("Error", "La contraseña debe tener al menos una mayúscula.");
      return;
    }

    setLoading(true);
    try {
      // conexión limpia al servidor
      await authService.register(nombre, email.toLowerCase(), password);

      Alert.alert("¡Éxito!", "Cuenta creada correctamente. ¡Ahora inicia sesión!");
      
      setNombre("");
      setEmail("");
      setPassword("");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error en el registro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>¡Únete a OfertasYa!</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!mostrarPassword}
        />
        <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
          <Text style={styles.verTexto}>
            {mostrarPassword ? "Ocultar" : "Ver"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        La contraseña debe tener al menos 8 caracteres y una mayúscula.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#E75480" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Registrarme</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.backLink}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#FFF5F5" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#E75480", marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: "center", color: "#FFB6C1", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#FFB6C1", padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16, backgroundColor: "#FFF" },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#FFB6C1", borderRadius: 12, marginBottom: 5, backgroundColor: "#FFF", paddingRight: 10 },
  passwordInput: { flex: 1, padding: 15, fontSize: 16 },
  verTexto: { fontSize: 14, color: "#E75480", fontWeight: "bold", padding: 5 },
  hint: { fontSize: 12, color: "#FFB6C1", textAlign: "center", marginBottom: 15 },
  registerButton: { backgroundColor: "#E75480", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  registerButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  loader: { marginTop: 20 },
  backLink: { textAlign: "center", marginTop: 20, color: "#E75480", fontSize: 15, fontWeight: "bold" }
});