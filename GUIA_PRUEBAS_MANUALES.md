# 🧪 GUÍA DE PRUEBAS MANUALES - F4, F5, F6

**Sistema:** BARBOX Backoffice  
**Versión:** 1.0  
**Acceso:** http://localhost:3000

---

## 🔐 INICIO DE SESIÓN

1. Navegar a `http://localhost:3000/login`
2. Credenciales de prueba (si está implementado):
   - Usuario: admin
   - Contraseña: (cualquiera, es simulación)
3. O usar `/clientes` directamente (sin autenticación en demo)

---

## 🔷 PRUEBAS F4 - MÓDULO CLIENTES

### F4.1 - Ingreso de Clientes ✅

**URL:** `/clientes/nuevo`

**Pasos:**
1. Hacer clic en "Nueva Cliente" (botón verde)
2. Completar formulario:
   ```
   Cédula:       1234567890  (10 dígitos)
   Nombres:      Juan Pérez
   Apellidos:    García López
   Empresa:      Distribuidora XYZ
   Email:        juan.perez@email.com
   Teléfono:     0987654321
   ```
3. Hacer clic en "Guardar"

**Validaciones Esperadas:**
- ✅ Mensaje: "Cliente creado exitosamente"
- ✅ Cliente aparece en lista con estado "Activo" (verde)
- ✅ Cédula guardada: 1234567890

**Intentar crear duplicado:**
1. Intentar crear otro cliente con cédula 1234567890
2. Esperar: Error "El identificador del cliente ya existe"

---

### F4.2 - Actualización de Clientes ✅

**URL:** `/clientes`

**Pasos:**
1. En lista de clientes, buscar por cédula: `0123456789`
2. Hacer clic en "Editar" (lápiz azul)
3. Cambiar nombre: `Juan Carlos` → `Juan Carlos Pérez`
4. Hacer clic en "Actualizar"

**Validaciones Esperadas:**
- ✅ Mensaje: "Cliente actualizado correctamente"
- ✅ Cambio visible en lista
- ✅ Nombre ahora es: "Juan Carlos Pérez"

---

### F4.3 - Eliminación Lógica ✅

**URL:** `/clientes`

**Pasos:**
1. En lista, seleccionar cliente (click en fila)
2. Hacer clic en "Eliminar" (botón rojo con icono trash)
3. Confirmar en modal: "¿Desactivar cliente?"
4. Clic en "Eliminar"

**Validaciones Esperadas:**
- ✅ Mensaje: "Cliente desactivado correctamente"
- ✅ Cliente desaparece de lista (solo muestra ACT)
- ✅ Estado cambió a "Inactivo" internamente

**Verificar permanencia en BD:**
1. Abrir DevTools (F12)
2. Console: `JSON.parse(localStorage.CLIENTES).find(c => c.cedula === '0123456789')`
3. Ver: `estado: "INA"` (el registro existe pero inactivo)

---

### F4.4 - Búsqueda y Consulta ✅

**URL:** `/clientes`

**Búsqueda por Cédula:**
1. Ingresar en campo "Cédula": `0123456789`
2. Hacer clic en "Buscar"
3. Esperar: Muestra solo cliente con esa cédula

**Búsqueda por Nombre:**
1. Limpiar filtros
2. Ingresar en campo "Nombre": `Juan`
3. Hacer clic en "Buscar"
4. Esperar: Muestra todos con "Juan" en nombre

**Filtro por Estado:**
1. Hacer clic en dropdown "Estado"
2. Seleccionar "Activo (ACT)"
3. Clic "Buscar"
4. Esperar: Muestra solo clientes ACT

**Limpiar Filtros:**
1. Hacer clic en "Limpiar"
2. Esperar: Lista completa restaurada

**Validaciones Esperadas:**
- ✅ Búsqueda por cédula funciona
- ✅ Búsqueda por nombre funciona
- ✅ Filtro por estado funciona
- ✅ Limpiar restaura lista original

---

## 🔶 PRUEBAS F5 - MÓDULO FACTURAS

### F5.1 - Ingreso de Facturas ✅

**URL:** `/facturas/nueva`

**Pasos:**
1. Hacer clic en "Nueva Factura"
2. Seleccionar cliente (dropdown)
3. Sistema carga número automático (001-001-20260111XXXX)
4. Agregar productos:
   - Hacer clic en "Agregar Producto"
   - Seleccionar: "Johnnie Walker Red Label 750ml"
   - Cantidad: 2
   - Precio se carga automático: $28.50
   - Subtotal de línea: $57.00
5. Hacer clic en "Agregar"
6. Ver cálculos:
   ```
   Subtotal: $57.00
   IVA (12%): $6.84
   Total:     $63.84
   ```
7. Hacer clic en "Guardar Factura"

**Validaciones Esperadas:**
- ✅ Número de factura generado: 001-001-20260111XXXX
- ✅ Estado: "PEN" (Pendiente, amarillo)
- ✅ Mensaje: "Factura creada exitosamente"
- ✅ Factura aparece en lista

---

### F5.2 - Anulación de Facturas ✅

**URL:** `/facturas`

**Pasos:**
1. En lista, encontrar factura con estado "PEN" (Pendiente)
2. Hacer clic en factura
3. Buscar botón "Anular" (rojo)
4. Hacer clic
5. Confirmar en modal

**Validaciones Esperadas:**
- ✅ Mensaje: "Factura anulada correctamente"
- ✅ Estado cambió a "ANULADA" (rojo)
- ✅ Botones de edición desaparecen

**Intentar Anular PAGADA:**
1. Si hay factura "PAGADA"
2. Intentar hacer clic en "Anular"
3. Error esperado: "No se puede anular factura en estado PAGADA"

---

### F5.3 - Modificación de Facturas ✅

**URL:** `/facturas`

**Pasos:**
1. En lista, seleccionar factura "PEN"
2. Hacer clic en "Editar"
3. Cambiar cantidad de producto: 2 → 3
4. Totales recalculan automático
5. Hacer clic en "Guardar Cambios"

**Validaciones Esperadas:**
- ✅ Cantidad actualizada: 2 → 3
- ✅ Subtotal recalculado: $57 → $85.50
- ✅ IVA recalculado: $10.26
- ✅ Total recalculado: $95.76
- ✅ Mensaje: "Factura actualizada correctamente"

**Intentar Editar PAGADA:**
1. Si hay factura "PAGADA"
2. Hacer clic en "Editar"
3. Error esperado: "No se puede modificar factura en estado PAGADA"

---

### F5.4 - Consulta y Búsqueda ✅

**URL:** `/facturas`

**Filtro por Estado:**
1. Dropdown "Estado": Seleccionar "PEN"
2. Clic "Aplicar"
3. Muestra solo facturas pendientes (amarillas)

**Filtro por Fechas:**
1. Campo "Desde": 2026-01-01
2. Campo "Hasta": 2026-01-31
3. Clic "Aplicar"
4. Muestra facturas en ese rango

**Búsqueda por Número:**
1. Campo "Búsqueda": 001-001
2. Clic "Aplicar"
3. Muestra facturas coincidentes

**Validaciones Esperadas:**
- ✅ Filtro por estado funciona
- ✅ Filtro por fechas funciona
- ✅ Búsqueda por número funciona
- ✅ Limpiar restaura lista

---

## 🟡 PRUEBAS F6 - MÓDULO PRODUCTOS

### F6.1 - Ingreso de Productos ✅

**URL:** `/productos/nuevo`

**Pasos:**
1. Hacer clic en "Nuevo Producto"
2. Completar formulario:
   ```
   Código Barras:  7789999888888  (único)
   Nombre:         Cerveza Premium Artesanal
   Descripción:    Bebida con 5.5% alcohol contenido
   Precio:         3.50
   Stock:          150
   Categoría:      Cerveza
   Marca:          Artesana
   ```
3. Hacer clic en "Guardar Producto"

**Validaciones Esperadas:**
- ✅ Mensaje: "Producto creado exitosamente"
- ✅ Producto aparece en lista con estado "Activo" (verde)
- ✅ Código barras: 7789999888888
- ✅ Precio: $3.50

**Intentar Crear Duplicado:**
1. Intentar crear otro con código barras 7789999888888
2. Error esperado: "El identificador del producto ya existe"

---

### F6.2 - Actualización de Productos ✅

**URL:** `/productos`

**Pasos:**
1. En lista, buscar producto por descripción: "Cerveza"
2. Hacer clic en "Editar"
3. Cambiar:
   - Precio: 3.50 → 3.75
   - Stock: 150 → 200
4. Hacer clic en "Guardar"

**Validaciones Esperadas:**
- ✅ Precio actualizado: 3.50 → 3.75
- ✅ Stock actualizado: 150 → 200
- ✅ Mensaje: "Producto actualizado correctamente"
- ✅ Código barras NO puede cambiar (campo gris)

**Intentar Precio Negativo:**
1. Cambiar precio a -5.00
2. Hacer clic guardar
3. Error esperado: "El precio debe ser positivo"

---

### F6.3 - Eliminación Lógica ✅

**URL:** `/productos`

**Pasos:**
1. En lista, seleccionar producto "Activo"
2. Hacer clic en "Eliminar"
3. Modal confirma: "¿Desactivar producto?"
4. Clic en "Eliminar"

**Validaciones Esperadas:**
- ✅ Mensaje: "Producto desactivado correctamente"
- ✅ Producto desaparece de lista (solo muestra ACT)
- ✅ Estado cambió a "Inactivo" internamente

**Intentar Eliminar INA:**
1. Si queda un producto INA en base
2. Intentar eliminarlo
3. Error: "El producto ya se encuentra deshabilitado"

---

### F6.4 - Búsqueda y Consulta ✅

**URL:** `/productos`

**Búsqueda por Descripción:**
1. Campo "Búsqueda": `cerveza`
2. Clic "Buscar"
3. Muestra productos con "cerveza" en nombre/descripción

**Filtro por Categoría:**
1. Dropdown "Categoría": Cerveza
2. Clic "Buscar"
3. Muestra solo productos de categoría Cerveza

**Filtro por Rango de Precio:**
1. Campo "Precio Mínimo": 2.00
2. Campo "Precio Máximo": 5.00
3. Clic "Buscar"
4. Muestra productos en rango $2-$5

**Combinados:**
1. Descripción: "cerveza"
2. Categoría: "Cerveza"
3. Precio: 2.00 - 5.00
4. Clic "Buscar"
5. Resultado refinado

**Validaciones Esperadas:**
- ✅ Búsqueda por descripción funciona
- ✅ Filtro por categoría funciona
- ✅ Filtro por precio funciona
- ✅ Filtros combinados funcionan
- ✅ Muestra solo ACT por defecto
- ✅ Limpiar restaura lista

---

## 📊 VERIFICACIÓN EN DEVTOOLS

### Ver localStorage

**Pasos:**
1. Abrir DevTools (F12 o Ctrl+Shift+I)
2. Ir a "Application" → "Local Storage"
3. Seleccionar `http://localhost:3000`
4. Ver keys: `CLIENTES`, `FACTURAS`, `PRODUCTOS`

**Verificar Clientes:**
```javascript
// En Console:
JSON.parse(localStorage.CLIENTES)
// Ver: cedula, estado ('ACT'|'INA'), etc.
```

**Verificar Facturas:**
```javascript
JSON.parse(localStorage.FACTURAS)
// Ver: estado_pago ('PEN'|'PAGADA'|'ANULADA')
```

**Verificar Productos:**
```javascript
JSON.parse(localStorage.PRODUCTOS)
// Ver: codigo_barras, estado ('ACT'|'INA')
```

---

## 🐛 TROUBLESHOOTING

### Problema: Página en blanco
**Solución:**
1. Ctrl+Shift+Delete (Borrar cache/localStorage)
2. F5 (Refrescar)
3. Navegar a `/clientes` directamente

### Problema: Validación no funciona
**Solución:**
1. Abrir DevTools (F12)
2. Ver Console para errores
3. Verificar que localStorage no está corrupto

### Problema: Cambios no se guardan
**Solución:**
1. Verificar que localStorage está habilitado
2. Verificar cuota de localStorage (5-10MB)
3. Ver si navegador tiene modo privado (no guarda)

### Problema: Estados no actualizan
**Solución:**
1. Refrescar página (F5)
2. Si persiste, limpiar localStorage y reiniciar

---

## ✅ CHECKLIST DE PRUEBAS

### F4 - Clientes
- [ ] Crear cliente con cédula válida
- [ ] Validación de cédula duplicada
- [ ] Actualizar cliente ACT
- [ ] Error al actualizar cliente INA
- [ ] Eliminar cliente (cambio a INA)
- [ ] Búsqueda por cédula
- [ ] Búsqueda por nombre
- [ ] Filtro por estado
- [ ] Limpiar filtros

### F5 - Facturas
- [ ] Crear factura (estado PEN)
- [ ] Validación de detalles (1+ requerido)
- [ ] Cálculos de IVA correctos
- [ ] Número generado (001-001-...)
- [ ] Anular factura PEN
- [ ] Error al anular PAGADA
- [ ] Modificar factura PEN
- [ ] Error al modificar PAGADA
- [ ] Búsqueda por estado
- [ ] Búsqueda por fecha

### F6 - Productos
- [ ] Crear producto con codigo_barras
- [ ] Validación de codigo_barras duplicado
- [ ] Validación de precio > 0
- [ ] Actualizar producto ACT
- [ ] Error al actualizar INA
- [ ] Eliminar producto (cambio a INA)
- [ ] Error al eliminar INA
- [ ] Búsqueda por descripción
- [ ] Filtro por categoría
- [ ] Filtro por precio
- [ ] Filtros combinados

---

## 📱 URLs DIRECTAS

**Módulos:**
- Clientes: http://localhost:3000/clientes
- Facturas: http://localhost:3000/facturas
- Productos: http://localhost:3000/productos
- Dashboard: http://localhost:3000/dashboard

**Formularios:**
- Nuevo Cliente: http://localhost:3000/clientes/nuevo
- Nuevo Factura: http://localhost:3000/facturas/nueva
- Nuevo Producto: http://localhost:3000/productos/nuevo

---

## 📝 REPORTE DE PRUEBAS

Después de completar todas las pruebas, generar reporte con:
- ✅ Casos pasados
- ❌ Casos fallidos
- ⚠️ Problemas encontrados
- 💡 Sugerencias

---

**Última Actualización:** 11 de Enero, 2026  
**Sistema:** BARBOX Backoffice 1.0  
**Estado:** Listo para Pruebas

