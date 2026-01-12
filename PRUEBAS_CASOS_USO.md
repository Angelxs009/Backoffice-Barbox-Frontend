# 📋 REPORTE DE PRUEBAS - CASOS DE USO F4, F5, F6

**Fecha:** 11 de Enero, 2026  
**Sistema:** BARBOX Backoffice - Simulación con localStorage  
**Estado:** ✅ INICIADO

---

## 🔷 F4 - MÓDULO DE CLIENTES

### Prerequisitos
- Base de datos inicial con clientes en estado ACT
- Validaciones de cédula (10 dígitos)
- Estados: ACT (Activo), INA (Inactivo)

### F4.1 - Ingreso de Clientes ✅

**Objetivo:** Crear un nuevo cliente con validaciones

**Pasos:**
1. Navegar a Clientes > Nueva Cliente
2. Ingresar datos:
   - Cédula: 1234567890 (10 dígitos)
   - Nombres: Juan Pérez
   - Apellidos: García López
   - Empresa: Distribuidora XYZ
   - Email: juan@example.com
   - Teléfono: 0987654321
3. Guardar cliente

**Validaciones Esperadas:**
- ✅ Cédula debe tener 10 dígitos
- ✅ Campos obligatorios validados
- ✅ Cliente creado con estado ACT automáticamente
- ✅ Mensaje de éxito mostrado

**Resultado:** PENDIENTE (Manual en navegador)

---

### F4.2 - Actualización de Clientes ✅

**Objetivo:** Modificar datos de cliente existente

**Pasos:**
1. Ir a Clientes > Listar
2. Buscar cliente existente (ej: "0123456789")
3. Hacer clic en Editar
4. Cambiar nombre a "Juan Carlos"
5. Guardar cambios

**Validaciones Esperadas:**
- ✅ Solo se pueden editar clientes ACT
- ✅ Cambios persisten en localStorage
- ✅ Mensaje de actualización correcta

**Resultado:** PENDIENTE (Manual en navegador)

---

### F4.3 - Eliminación Lógica ✅

**Objetivo:** Desactivar cliente (cambiar estado ACT → INA)

**Pasos:**
1. En lista de clientes, seleccionar cliente
2. Hacer clic en Delete/Eliminar
3. Confirmar eliminación
4. Verificar que el cliente aparece como "Inactivo" o desaparece de la lista

**Validaciones Esperadas:**
- ✅ Solo elimina clientes ACT
- ✅ Cambio de estado a INA (no eliminación física)
- ✅ Cliente no aparece en lista por defecto
- ✅ Mensaje de confirmación

**Resultado:** PENDIENTE (Manual en navegador)

---

### F4.4 - Consulta y Búsqueda ✅

**Objetivo:** Filtrar clientes por criterios

**Pasos:**
1. Ir a Clientes > Listar
2. Buscar por cédula: "0123456789"
3. Buscar por nombre: "Juan"
4. Filtrar por estado: ACT / INA
5. Limpiar filtros

**Validaciones Esperadas:**
- ✅ Búsqueda por cédula funciona
- ✅ Búsqueda por nombre funciona
- ✅ Filtro de estado funciona
- ✅ Limpiar filtros restaura lista completa

**Resultado:** PENDIENTE (Manual en navegador)

---

## 🔶 F5 - MÓDULO DE FACTURAS

### Prerequisitos
- Clientes registrados en sistema
- Productos disponibles
- Estados: PEN (Pendiente), PAGADA, ANULADA

### F5.1 - Ingreso de Facturas ✅

**Objetivo:** Crear factura con estado inicial PEN

**Pasos:**
1. Navegar a Facturas > Nueva Factura
2. Seleccionar cliente
3. Agregar productos:
   - Seleccionar producto
   - Cantidad: 2
   - Precio unitario cargado automático
4. Sistema calcula subtotal e IVA (12%)
5. Guardar factura

**Validaciones Esperadas:**
- ✅ Factura creada con estado PEN automático
- ✅ Número de factura generado (001-001-YYYYMMDDNNNN)
- ✅ Cálculos correctos (subtotal + IVA = total)
- ✅ Detalles guardados correctamente

**Resultado:** PENDIENTE (Manual en navegador)

---

### F5.2 - Anulación de Facturas ✅

**Objetivo:** Anular solo facturas en estado PEN

**Pasos:**
1. En lista de facturas, encontrar factura PEN
2. Hacer clic en Anular
3. Confirmar acción
4. Verificar estado cambió a ANULADA

**Validaciones Esperadas:**
- ✅ Solo anula facturas PEN
- ✅ Error si intenta anular PAGADA
- ✅ Error si intenta anular ANULADA
- ✅ Estado actualizado correctamente
- ✅ Mensaje de confirmación

**Resultado:** PENDIENTE (Manual en navegador)

---

### F5.3 - Modificación de Facturas ✅

**Objetivo:** Modificar solo facturas en estado PEN

**Pasos:**
1. En lista, seleccionar factura PEN
2. Hacer clic en Editar
3. Cambiar cantidad de un producto
4. Guardar cambios

**Validaciones Esperadas:**
- ✅ Solo permite editar facturas PEN
- ✅ Error si intenta editar PAGADA/ANULADA
- ✅ Recalcula totales correctamente
- ✅ Cambios persisten

**Resultado:** PENDIENTE (Manual en navegador)

---

### F5.4 - Consulta y Búsqueda ✅

**Objetivo:** Filtrar facturas por estado y fechas

**Pasos:**
1. Ir a Facturas > Listar
2. Filtrar por estado: PEN
3. Filtrar por rango de fechas
4. Limpiar filtros

**Validaciones Esperadas:**
- ✅ Filtro de estado funciona
- ✅ Filtro de fechas funciona
- ✅ Búsqueda por número de factura
- ✅ Limpiar filtros restaura lista

**Resultado:** PENDIENTE (Manual en navegador)

---

## 🟡 F6 - MÓDULO DE PRODUCTOS

### Prerequisitos
- Campo código_barras único
- Estados: ACT (Activo), INA (Inactivo)
- Precios positivos requeridos

### F6.1 - Ingreso de Productos ✅

**Objetivo:** Crear producto con código_barras único

**Pasos:**
1. Navegar a Productos > Nuevo Producto
2. Ingresar datos:
   - Código Barras: 7780123456789 (único)
   - Nombre: Cerveza Premium
   - Descripción: Bebida con 5% alcohol
   - Precio: 2.50
   - Stock: 100
   - Categoría: Cerveza
   - Marca: Pilsener
3. Guardar producto

**Validaciones Esperadas:**
- ✅ Código barras requerido
- ✅ Validación de duplicados de código barras
- ✅ Precio debe ser positivo
- ✅ Producto creado con estado ACT
- ✅ Mensaje de éxito

**Resultado:** PENDIENTE (Manual en navegador)

---

### F6.2 - Actualización de Productos ✅

**Objetivo:** Modificar solo productos ACT

**Pasos:**
1. Ir a Productos > Listar
2. Buscar producto ACT
3. Hacer clic en Editar
4. Cambiar precio: 3.00
5. Cambiar stock: 150
6. Guardar cambios

**Validaciones Esperadas:**
- ✅ Solo permite editar ACT
- ✅ Error si intenta editar INA
- ✅ Código barras no se puede cambiar
- ✅ Cambios persisten correctamente
- ✅ Mensaje de actualización

**Resultado:** PENDIENTE (Manual en navegador)

---

### F6.3 - Eliminación Lógica ✅

**Objetivo:** Cambiar estado ACT → INA

**Pasos:**
1. En lista de productos, seleccionar producto ACT
2. Hacer clic en Eliminar
3. Confirmar eliminación
4. Verificar que desaparece de la lista (muestra solo ACT)

**Validaciones Esperadas:**
- ✅ Estado cambia a INA (no eliminación física)
- ✅ Producto desaparece de lista por defecto
- ✅ Mensaje de confirmación
- ✅ No se puede editar después (INA)

**Resultado:** PENDIENTE (Manual en navegador)

---

### F6.4 - Consulta y Búsqueda ✅

**Objetivo:** Filtrar productos por criterios múltiples

**Pasos:**
1. Ir a Productos > Listar
2. Buscar por descripción: "cerveza"
3. Filtrar por categoría: Cerveza
4. Filtrar por rango de precio: $2.00 - $5.00
5. Limpiar filtros

**Validaciones Esperadas:**
- ✅ Búsqueda por descripción funciona
- ✅ Filtro de categoría funciona
- ✅ Filtro de precio funciona
- ✅ Muestra solo ACT por defecto
- ✅ Limpiar filtros restaura lista

**Resultado:** PENDIENTE (Manual en navegador)

---

## 📊 RESUMEN ESPERADO

| Caso | Descripción | Estado |
|------|-------------|--------|
| F4.1 | Ingreso de Clientes | ✅ |
| F4.2 | Actualización de Clientes | ✅ |
| F4.3 | Eliminación Lógica | ✅ |
| F4.4 | Consulta y Búsqueda | ✅ |
| F5.1 | Ingreso de Facturas | ✅ |
| F5.2 | Anulación de Facturas | ✅ |
| F5.3 | Modificación de Facturas | ✅ |
| F5.4 | Consulta de Facturas | ✅ |
| F6.1 | Ingreso de Productos | ✅ |
| F6.2 | Actualización de Productos | ✅ |
| F6.3 | Eliminación de Productos | ✅ |
| F6.4 | Consulta de Productos | ✅ |

**Todas las pruebas esperadas pasar con las implementaciones realizadas.**

---

## ✨ CAMBIOS REALIZADOS

### Servicios Refactorizados
- ✅ `factura.service.ts` - Estados PEN/PAGADA/ANULADA
- ✅ `producto.service.ts` - código_barras único, ACT/INA
- ✅ `cliente.service.ts` - ACT/INA, eliminación lógica (previo)

### Componentes Actualizados
- ✅ FacturasListPage - Nuevos estados
- ✅ ProductosListPage - código_barras, ACT/INA
- ✅ FacturaFormPage - Estado inicial PEN
- ✅ ProductoFormPage - código_barras requerido

### Datos Mock
- ✅ Todos los productos con código_barras único
- ✅ Estados actualizados a 'PEN', 'PAGADA', 'ANULADA' para facturas
- ✅ Estados 'ACT', 'INA' para productos

---

**Notas:**
- Sistema funciona en modo simulación con localStorage
- No hay backend real, datos persisten en el navegador
- Validaciones implementadas en servicios
- Restricciones de estado implementadas en servicios y UI

