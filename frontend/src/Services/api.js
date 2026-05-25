import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://proyectofinal-9evf.onrender.com'

// Función base reutilizable para hacer peticiones al servidor
const apiRequest = async (endpoint, method = 'GET', body = null, requireAuth = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Token de seguridad
    if (requireAuth) {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ocurrió un error en el servidor');
    }

    return data;
  } catch (error) {
    console.error(`Error en la petición [${method}] ${endpoint}:`, error.message);
    throw error;
  }
};


// Autenticación (Login y Registro)
export const authService = {
  login: async (email, password) => {
    return await apiRequest('/auth/login', 'POST', { email, password });
  },
  register: async (nombre, email, password) => {
    return await apiRequest('/auth/register', 'POST', { nombre, email, password });
  },
};

// Ofertas (Catálogo de descuentos)
export const ofertasService = {
  getAll: async () => {
    return await apiRequest('/ofertas', 'GET');
  },
  getById: async (id) => {
    return await apiRequest(`/ofertas/${id}`, 'GET');
  },
};

// Favoritos (Rutas protegidas con Token)
export const favoritosService = {
  getMine: async () => {
    return await apiRequest('/favoritos', 'GET', null, true); 
  },
  add: async (ofertaId) => {
    return await apiRequest('/favoritos', 'POST', { ofertaId }, true);
  },
  remove: async (id) => {
    return await apiRequest(`/favoritos/${id}`, 'DELETE', null, true);
  },
};

// Tiendas y Categorías
export const tiendasService = {
  getAll: async () => {
    return await apiRequest('/tiendas', 'GET');
  },
};