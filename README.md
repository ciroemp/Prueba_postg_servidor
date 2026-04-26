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
- dotenv

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

## V1.1 se agregó para imgs

-- 1. Crear la base de datos
CREATE DATABASE Tienda;

-- 2. Conectarse a la base de datos (Comando para psql)
\c Tienda;

-- 3. Crear la tabla con la columna 'imagen' incluida
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    stock INT NOT NULL,
    categoria VARCHAR(50),
    imagen VARCHAR(255) -- Nombre del archivo para la ruta profesional
);

-- 4. Insertar los productos con sus respectivos nombres de imagen
-- Nota: Asegúrate de que estos nombres coincidan con los archivos en public/img/
INSERT INTO productos(nombre, precio, stock, categoria, imagen) VALUES
('Martillo', 10.5, 20, 'Herramientas', 'martillo.jpg'),
('Taladro', 75, 5, 'Electricos', 'taladro.jpg'),
('Clavos', 2, 100, 'Materiales', 'clavos.jpg'),
('Sierra', 25, 8, 'Herramientas', 'sierra.jpg'),
('Cemento', 8, 50, 'Construccion', 'cemento.jpg'),
('Pintura', 15, 30, 'Acabados', 'pintura.jpg'),
('Llave inglesa', 12, 15, 'Herramientas', 'llave-inglesa.jpg'),
('Destornillador', 5, 40, 'Herramientas', 'destornillador.jpg'),
('Brocas', 7, 60, 'Electricos', 'brocas.jpg'),
('Lija', 3, 80, 'Acabados', 'lija.jpg'),
('Tornillos', 4, 120, 'Materiales', 'tornillos.jpg'),
('Escalera', 50, 3, 'Equipos', 'escalera.jpg'),
('Manguera', 20, 10, 'Jardin', 'manguera.jpg'),
('Guantes', 6, 25, 'Seguridad', 'guantes.jpg'),
('Casco', 18, 12, 'Seguridad', 'casco.jpg');