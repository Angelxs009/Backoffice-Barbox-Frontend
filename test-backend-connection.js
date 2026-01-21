/**
 * Script de prueba para verificar conexión con el backend
 * Ejecutar: node test-backend-connection.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

async function testConnection() {
  log('\n🔍 PRUEBA DE CONEXIÓN AL BACKEND\n', 'blue');
  log(`URL Base: ${BASE_URL}\n`, 'yellow');

  // Test 1: Health check (si existe)
  try {
    log('1️⃣ Probando endpoint /health o /');
    const response = await axios.get(`${BASE_URL}/`);
    log(`   ✅ Conectado - Status: ${response.status}`, 'green');
  } catch (error) {
    log(`   ⚠️  Endpoint /health no disponible (${error.message})`, 'yellow');
  }

  // Test 2: Login
  try {
    log('\n2️⃣ Probando POST /auth/login');
    const loginData = {
      email: 'admin@barbox.com',
      password: 'admin123'
    };
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    
    if (response.data.status === 'success' && response.data.data.token) {
      log(`   ✅ Login exitoso - Token recibido`, 'green');
      global.token = response.data.data.token;
    } else {
      log(`   ❌ Login falló - Respuesta: ${JSON.stringify(response.data)}`, 'red');
    }
  } catch (error) {
    log(`   ❌ Error en login: ${error.response?.data?.message || error.message}`, 'red');
  }

  // Test 3: Listar productos
  try {
    log('\n3️⃣ Probando GET /productos');
    const config = global.token ? {
      headers: { Authorization: `Bearer ${global.token}` }
    } : {};
    
    const response = await axios.get(`${BASE_URL}/productos`, config);
    
    if (response.data.status === 'success') {
      const productos = response.data.data;
      log(`   ✅ Productos obtenidos - Total: ${productos.length}`, 'green');
      if (productos.length > 0) {
        log(`   📦 Primer producto: ${productos[0].descripcion}`, 'yellow');
        log(`   📋 Campos: ${Object.keys(productos[0]).join(', ')}`, 'yellow');
      }
    } else {
      log(`   ❌ Respuesta inesperada: ${JSON.stringify(response.data)}`, 'red');
    }
  } catch (error) {
    log(`   ❌ Error al obtener productos: ${error.response?.data?.message || error.message}`, 'red');
  }

  // Test 4: Listar clientes
  try {
    log('\n4️⃣ Probando GET /clientes');
    const config = global.token ? {
      headers: { Authorization: `Bearer ${global.token}` }
    } : {};
    
    const response = await axios.get(`${BASE_URL}/clientes`, config);
    
    if (response.data.status === 'success') {
      const clientes = response.data.data;
      log(`   ✅ Clientes obtenidos - Total: ${clientes.length}`, 'green');
      if (clientes.length > 0) {
        log(`   👤 Primer cliente: ${clientes[0].nombre1} ${clientes[0].apellido1}`, 'yellow');
        log(`   📋 Campos: ${Object.keys(clientes[0]).join(', ')}`, 'yellow');
      }
    } else {
      log(`   ❌ Respuesta inesperada: ${JSON.stringify(response.data)}`, 'red');
    }
  } catch (error) {
    log(`   ❌ Error al obtener clientes: ${error.response?.data?.message || error.message}`, 'red');
  }

  log('\n✅ Pruebas completadas\n', 'blue');
}

// Ejecutar pruebas
testConnection().catch(err => {
  log(`\n❌ Error fatal: ${err.message}\n`, 'red');
  process.exit(1);
});
