# Evaluación del Sistema ERP y Preparación para la Base de Datos

He revisado a fondo el estado actual del proyecto (Clean Architecture en Next.js) de cara a tu próximo paso: el diseño de la base de datos real. 

A nivel visual y de flujo el software está excelente, pero a nivel de estructura de datos existen varias inconsistencias y redundancias que se crearon al hacer los *mocks* rápidos. Aquí tienes el diagnóstico y lo que debes corregir.

---

## 1. Inconsistencia Crítica: Modelos vs Entidades
Actualmente tienes dos carpetas que hacen lo mismo pero tienen estructuras diferentes, lo cual causará problemas al conectarlo a una Base de Datos:
- `src/domain/entities/` (Usado principalmente por el módulo Cliente).
- `src/domain/models/` (Usado principalmente por el módulo Administrador).

**Ejemplo del problema (Vehículos):**
- En `entities/Vehicle.ts` el vehículo solo tiene: `plate`, `model`, `brand`, `year`.
- En `models/vehicle.ts` el vehículo tiene: `id`, `vin`, `plate`, `brand`, `model`, `year`, `mileage`, `status`, `assignedClientId`, `maintenanceHistory`.

> [!IMPORTANT]
> **Solución antes de la BD:** Debes unificar todo en una sola carpeta (recomiendo `src/domain/models/` o `src/domain/entities/`, pero no ambas) para que haya una única fuente de verdad. El esquema de la BD debe basarse en el modelo más completo (el del Admin).

## 2. Redundancia en los Servicios/Repositorios
Actualmente el código tiene dos formas de acceder a la misma "información":
- El Cliente usa servicios (`vehicleService.ts`) que tienen sus propios mocks separados.
- El Admin usa repositorios (`vehicle-repository-impl.ts`) que tienen otra lista de mocks.
Esto significa que si agregas un vehículo en el admin, el cliente no lo ve, porque usan archivos diferentes.

> [!TIP]
> **Solución:** Al implementar la base de datos (ej. PostgreSQL con Prisma o Supabase), ambos módulos (Cliente y Admin) deben consumir exactamente las mismas tablas a través de los mismos Casos de Uso (`useCases`).

---

## 3. Propuesta de Arquitectura de Base de Datos (Relacional)

Al diseñar tu esquema (SQL), ten en cuenta estas relaciones clave que actualmente están sueltas en los Mocks:

### A. Usuarios y Roles (Users)
- **Campos sugeridos:** `id`, `email`, `password_hash`, `role` (ENUM: ADMIN, MECHANIC, CLIENT), `first_name`, `last_name`, `phone`, `is_active`.
- **Nota:** No crees una tabla separada para "Clientes", "Mecánicos" y "Admins". Usa una sola tabla de `Users` y diferéncialos por el campo `role`.

### B. Vehículos (Vehicles)
- **Relación:** Pertenece a un `User` (donde role = CLIENT).
- **Campos sugeridos:** `id`, `client_id` (Foreign Key -> Users), `plate` (Único), `vin`, `brand`, `model`, `year`, `mileage`, `status` (ENUM: AVAILABLE, MAINTENANCE).

### C. Órdenes de Trabajo (WorkOrders)
- **Relaciones:** Pertenece a un `Vehicle` y es asignada a un `User` (donde role = MECHANIC). 
- **Campos sugeridos:** `id`, `vehicle_id` (FK), `mechanic_id` (FK, opcional/nullable), `title`, `description`, `status`, `priority`, `estimated_cost`, `actual_cost`.
- *Observación:* Actualmente el mock de WorkOrder guarda el `clientId`, esto es redundante en una BD relacional porque ya puedes saber quién es el cliente a través del `vehicle_id`.

### D. Citas (Appointments)
- **Relaciones:** Pertenece a un `Vehicle`.
- **Campos sugeridos:** `id`, `vehicle_id` (FK), `date`, `time`, `service_type`, `status`.

### E. Inventario (InventoryItems)
- **Campos sugeridos:** `id`, `sku` (Único), `name`, `category`, `quantity`, `min_quantity`, `unit_price`, `supplier`.

### F. Facturación (Invoices e InvoiceItems)
> [!WARNING]
> En los mocks actuales, los ítems de la factura son un simple arreglo (`items: []`). En una base de datos real, esto se considera un anti-patrón (1ra Forma Normal).
- **Tabla `Invoices`:** `id`, `invoice_number` (Único), `client_id` (FK), `vehicle_id` (FK), `total`, `status`, `issue_date`, `due_date`.
- **Tabla `InvoiceItems`:** `id`, `invoice_id` (FK -> Invoices), `description` (o FK al Inventario), `quantity`, `unit_price`, `subtotal`.

---

## 4. Validaciones Ausentes
Actualmente los formularios de creación (como los que acabamos de hacer) toman los datos y los meten directamente al mock. 
- En el futuro, antes de enviar la data a la Base de Datos, el backend (Next.js Server Actions o Route Handlers) debe validar que el `email` sea válido, que los `costos` sean números positivos, y que la `placa` tenga un formato correcto. 
- **Recomendación:** Considera agregar **Zod** para crear esquemas de validación estrictos en la capa de Aplicación/Dominio.

## Resumen del Plan de Acción
1. **Limpieza:** Borrar la carpeta `src/domain/entities/` y hacer que toda la app use `src/domain/models/`.
2. **Esquema:** Usar las sugerencias del punto 3 para crear el diagrama ER (Entidad-Relación). Herramientas recomendadas: dbdiagram.io o Prisma Schema.
3. **ORM:** Selecciona un ORM (como Prisma o Drizzle) para conectar tu Clean Architecture con la base de datos de manera fuertemente tipada.
