-- ============================================
-- Beauty by Salomé Galindo - Base de Datos
-- ============================================

DROP DATABASE IF EXISTS beauty_salome;
CREATE DATABASE IF NOT EXISTS beauty_salome CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beauty_salome;

-- USUARIOS
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('cliente', 'admin') DEFAULT 'cliente',
    reset_codigo VARCHAR(10),
    reset_expira DATETIME,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORÍAS
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255)
);

-- PRODUCTOS
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    imagen_url VARCHAR(255),
    categoria_id INT,
    marca VARCHAR(100),
    destacado BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- DIRECCIONES
CREATE TABLE direcciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100),
    codigo_postal VARCHAR(20),
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- PEDIDOS
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    estado ENUM('pendiente','confirmado','en_camino','entregado','cancelado') DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('transferencia','contra_entrega','nequi') DEFAULT 'transferencia',
    direccion_entrega VARCHAR(255),
    ciudad_entrega VARCHAR(100),
    notas TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ITEMS DE PEDIDO
CREATE TABLE pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- CARRITO
CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- ============================================
-- DATOS INICIALES
-- ============================================

INSERT INTO categorias (id, nombre, descripcion) VALUES
(1, 'Labios',     'Brillos, labiales y accesorios de labios'),
(2, 'Ojos',       'Pestañinas y accesorios para ojos'),
(3, 'Rostro',     'Rubores, iluminadores, polvos y primer'),
(4, 'Accesorios', 'Caimanes, balacas, cepillos y cosmetiqueras'),
(5, 'Otros',      'Termos y productos varios');

-- Admin (password: admin123)
INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES
('Salomé Galindo', 'admin@beautysalome.com', '$2b$10$tlOQVY2GJhqZGHVQZBnpGe9WHcaV6ReRJGQcWbdTezcF1N63uvsIu', 'admin');

-- PRODUCTOS CON IMÁGENES
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria_id, marca, destacado, activo) VALUES

-- LABIOS
('Brillo Gloss Lip Balm Glossy', 'Brillo gloss hidratante con acabado glossy', 22000, 20,
 'https://tutiendaprama.com/wp-content/uploads/2024/11/01-2024-11-06T110513.092.jpg',
 1, 'Olibolla', TRUE, TRUE),

('Brillo Gloss con Color Lip Oil', 'Lip oil con color de larga duración', 25000, 20,
 'https://bloomshell.co/wp-content/uploads/2025/04/120.png',
 1, 'Bloomshell', TRUE, TRUE),

('Popsocket Corazón para Gloss', 'Accesorio popsocket en forma de corazón para gloss', 12000, 30,
 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQLcr40dWRiDXEG3S5vNPlQLuzFmSH92ZyTJpjkZ5J1ZMdSb98GqFpHl6AC-zGzQH9fN8jkMPrIsAjRRnxvcKZmmWkyX3w78zmVJmq712fFHROsiE4BqUylhSo',
 1, 'Generic', FALSE, TRUE),

-- OJOS
('Pestañina Micro Fibras Gris Claro', 'Pestañina con micro fibras para máximo volumen', 38000, 15,
 'https://luegopagocdn.azureedge.net/content-process/products-images/prod/1468/8ebee6bc-1f22-4077-94fe-a69d7bf521c0.webp',
 2, 'Prosa', TRUE, TRUE),

('Pestañina Profesional Silicon Gris Oscura', 'Pestañina profesional de silicon tono gris oscuro', 38000, 15,
 'https://rooshcolombia.com/cdn/shop/files/Pestanina-Prosa-Microfibra-Gris-Silicon1.webp?v=1756392032',
 2, 'Prosa', TRUE, TRUE),

('Pestañina Maxi-Volumen Silicon Fucsia', 'Pestañina maxi-volumen en tono fucsia', 38000, 15,
 'https://www.magnacosmetics.co/wp-content/uploads/2025/07/0w0702.jpg',
 2, 'Prosa', FALSE, TRUE),

('Pestañina Maxi-Volumen Morada', 'Pestañina maxi-volumen en tono morado', 38000, 15,
 'https://tiendadistrisae.com/wp-content/uploads/2026/03/PESTANINAPROSAMAXIVOLUMEN01_900x.webp',
 2, 'Prosa', FALSE, TRUE),

-- ROSTRO
('Rubor Degradado Gradient Blush', 'Rubor en polvo con efecto degradado', 45000, 18,
 'https://ushascosmetics.com/cdn/shop/files/1_3081d067-39d9-4aff-9674-4c8506629879.png?v=1737786044&width=1080',
 3, 'Ushas', TRUE, TRUE),

('Iluminador en Polvo Highlighter', 'Iluminador en polvo de alta pigmentación', 55000, 12,
 'https://beautyface.com.co/cdn/shop/files/s2904894-main-zoom.webp?v=1774424209',
 3, 'Huda Beauty', TRUE, TRUE),

('Primer Bloom Poros Invisibles 18ml', 'Primer para minimizar poros, 18ml', 42000, 20,
 'https://bloomshell.co/wp-content/uploads/2026/02/Pagina-web-2-2-1.png',
 3, 'Bloomshell', TRUE, TRUE),

('Mini Polvo Suelto 4 Tonos Bloom Filter Línea Premium', 'Mini polvo suelto 4 tonos línea premium', 35000, 25,
 'https://bloomshell.co/wp-content/uploads/2025/11/196-3.png',
 3, 'Bloomshell', FALSE, TRUE),

('Polvo Suelto 4 Tonos Bloom Filter Línea Premium', 'Polvo suelto 4 tonos línea premium', 48000, 20,
 'https://bloomshell.co/wp-content/uploads/2025/11/197-2.png',
 3, 'Bloomshell', TRUE, TRUE),

('Polvo Suelto XL Translucent Matte', 'Polvo suelto XL translúcido acabado matte', 52000, 15,
 'https://bloomshell.co/wp-content/uploads/2025/07/226.png',
 3, 'Bloomshell', FALSE, TRUE),

('Polvo Grande Translucent 2en1', 'Polvo translúcido grande 2 en 1', 58000, 12,
 'https://bloomshell.co/wp-content/uploads/2025/09/99.png',
 3, 'Bloomshell', FALSE, TRUE),

('Iluminador en Polvo Bloom Glow', 'Iluminador en polvo efecto glow', 48000, 18,
 'https://www.pigmentta.com/wp-content/uploads/2024/09/Iluminador-Bloom-Glow-Bloomshell-4.jpg',
 3, 'Bloomshell', TRUE, TRUE),

('Rubor en Polvo Cheek Blusher', 'Rubor en polvo tono natural', 40000, 20,
 'https://lolybeautyshop.com/cdn/shop/files/6903072465279_f92ca751-ff24-47fb-b8be-b5125d4b7aac.jpg?v=1777497716&width=3840',
 3, 'Paulis', FALSE, TRUE),

-- ACCESORIOS
('Caiman Grande Rosa', 'Caiman para cabello grande color rosa', 8000, 40,
 'https://tubeautystore.co/cdn/shop/files/CAIMAN-EXTRAGRANDE-ROSADO-Inmoda-fantasy_1080x.jpg?v=1744009551',
 4, 'Generic', FALSE, TRUE),

('Cartón Caiman Grande y 2 Mini Caiman Flor Marmoleada', 'Set caiman grande + 2 mini caimanes diseño mármol', 15000, 25,
 'https://lolybeautyshop.com/cdn/shop/files/EL251462.jpg?v=1768505436&width=3840',
 4, 'Generic', FALSE, TRUE),

('Caiman Grande 3 Pétalos Marmoleado', 'Caiman grande diseño 3 pétalos marmoleado', 10000, 30,
 'https://i0.wp.com/www.districosmeticos.com/wp-content/uploads/2024/10/1691813591038.png?fit=500%2C500&ssl=1',
 4, 'Generic', FALSE, TRUE),

('Cepillo Esqueleto Espiral Fifty', 'Cepillo para cabello tipo esqueleto espiral', 18000, 20,
 'https://http2.mlstatic.com/D_NQ_NP_634621-MLA92571993749_092025-O.webp',
 4, 'Fifty', FALSE, TRUE),

('Cosmetiquera Bolso Grande Washbag', 'Cosmetiquera bolso grande estilo washbag', 35000, 15,
 'https://tubeautystore.co/cdn/shop/files/COSMETIQUERA-WASHBAG-GRANDE-Cosmetiquera-TU-beauty-store_1080x.jpg?v=1762586272',
 4, 'Generic', FALSE, TRUE),

('Cosmetiquera Grande Washbag', 'Cosmetiquera grande tipo washbag', 30000, 15,
 'https://tutiendaprama.com/wp-content/uploads/2023/05/cosmetiquerafdr.png',
 4, 'Generic', FALSE, TRUE),

('Gorro Satin', 'Gorro de satin para proteger el cabello', 22000, 25,
 'https://m.media-amazon.com/images/I/51bT9t6-WcL.jpg',
 4, 'Generic', FALSE, TRUE),

('Cartuchera con Borlas y Beauty Blender', 'Cartuchera con borlas incluye beauty blender', 28000, 20,
 'https://mabilyt.co/wp-content/uploads/2026/03/ch-2148-kit-beauty-blender-con-borlas-manfei-mabilyt.jpg?w=640',
 4, 'Generic', FALSE, TRUE),

('Cepillo Masajeador Bolsita', 'Cepillo masajeador de cuero cabelludo con bolsita', 20000, 20,
 'https://lolybeautyshop.com/cdn/shop/files/6909822810115.jpg?v=1764351243&width=3840',
 4, 'Miss Angel', FALSE, TRUE),

('Balaca Nube Animal Print Hand Made', 'Balaca nube animal print hecha a mano', 12000, 35,
 'https://http2.mlstatic.com/D_NQ_NP_625871-MCO83114337081_032025-O.webp',
 4, 'Generic', FALSE, TRUE),

('Balaca Nube con 3 Corazoncitos / Fresita / Pompones', 'Balaca nube decorada con corazoncitos, fresita o pompones', 12000, 35,
 'https://lolybeautyshop.com/cdn/shop/files/7702202520944.jpg?v=1766765493&width=3840',
 4, 'Generic', FALSE, TRUE),

-- OTROS
('Termo Peque Stanley 20 Onzas', 'Termo Stanley pequeño de 20 onzas', 65000, 10,
 'https://images.rappi.com/products/1729815023615_1729815018693_1729815018229.jpg',
 5, 'Stanley', TRUE, TRUE);

SELECT CONCAT(COUNT(*), ' productos insertados con imágenes') AS resultado FROM productos;