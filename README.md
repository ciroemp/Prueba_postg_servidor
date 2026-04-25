# Mi Proyecto

## 📌 Descripción
Aplicación web para gestión de productos de una ferretería.
Permite visualizar productos, agregar, editar y eliminar (solo admin).
Proyecto experimento para conectar una pagina a un servidor de base de datos.

## ⚙️ Tecnologías
- Node.js
- Express
- PostgreSQL
- JavaScript
- HTML + CSS

## 📁 Estructura
- /routes → endpoints API
- /middleware → control de acceso
- /public → frontend
- db.js → conexión a base de datos

## 🚀 Instalación NODE

1. Clonar repositorio
2. Instalar dependencias:
   npm install
3. Ejecutar servidor:
   npm start

## 🌐 Acceso
http://localhost:3000

## dotenv
Es una librería que permite usar variables desde un archivo .env 
Archivo que guarda credenciales

npm install dotenv  

## 🔐 Roles
- Admin → puede modificar productos
- Usuario → solo visualiza

## ⚠️ Notas
Si la base de datos no está disponible, la app mostrará mensaje de error pero seguirá funcionando.

## Script de Base de Datos V1.0 POSTGRESQL

CREATE DATABASE Tienda;

\c Tienda;

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    precio NUMERIC(10,2),
    stock INT,
    categoria VARCHAR(50)
);

INSERT INTO productos(nombre, precio, stock, categoria) VALUES
('Martillo', 10.5, 20, 'Herramientas'),
('Taladro', 75, 5, 'Electricos'),
('Clavos', 2, 100, 'Materiales'),
('Sierra', 25, 8, 'Herramientas'),
('Cemento', 8, 50, 'Construccion'),
('Pintura', 15, 30, 'Acabados'),
('Llave inglesa', 12, 15, 'Herramientas'),
('Destornillador', 5, 40, 'Herramientas'),
('Brocas', 7, 60, 'Electricos'),
('Lija', 3, 80, 'Acabados'),
('Tornillos', 4, 120, 'Materiales'),
('Escalera', 50, 3, 'Equipos'),
('Manguera', 20, 10, 'Jardin'),
('Guantes', 6, 25, 'Seguridad'),
('Casco', 18, 12, 'Seguridad');