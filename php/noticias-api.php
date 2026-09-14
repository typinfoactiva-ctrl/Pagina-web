<?php
// ============================================================
// API DE NOTICIAS - CRUD COMPLETO
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDBConnection();

if (!$pdo) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}

// ============================================================
// OBTENER TODAS LAS NOTICIAS (GET) - PÚBLICO
// ============================================================
if ($method === 'GET') {
    try {
        $stmt = $pdo->prepare("SELECT id, titulo, categoria, descripcion, imagen_url, fecha FROM noticias WHERE estado = 1 ORDER BY fecha DESC");
        $stmt->execute();
        $noticias = $stmt->fetchAll();
        echo json_encode(['success' => true, 'data' => $noticias]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// ============================================================
// VERIFICAR AUTENTICACIÓN PARA MÉTODOS POST, PUT, DELETE
// ============================================================
session_start();
if (!isset($_SESSION['user_rol']) || $_SESSION['user_rol'] !== 'admin') {
    echo json_encode(['success' => false, 'error' => 'No autorizado. Se requiere rol de administrador.']);
    exit;
}

// ============================================================
// AGREGAR NOTICIA (POST)
// ============================================================
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $titulo = trim($input['titulo'] ?? '');
    $categoria = trim($input['categoria'] ?? '');
    $descripcion = trim($input['descripcion'] ?? '');
    $imagen_url = trim($input['imagen_url'] ?? '');
    $fecha = trim($input['fecha'] ?? date('Y-m-d'));

    if (empty($titulo) || empty($descripcion)) {
        echo json_encode(['success' => false, 'error' => 'Título y descripción son requeridos']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO noticias (titulo, categoria, descripcion, imagen_url, fecha) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$titulo, $categoria, $descripcion, $imagen_url, $fecha]);
        $id = $pdo->lastInsertId();
        echo json_encode(['success' => true, 'id' => $id, 'message' => 'Noticia agregada correctamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// ============================================================
// ACTUALIZAR NOTICIA (PUT)
// ============================================================
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $id = intval($input['id'] ?? 0);
    $titulo = trim($input['titulo'] ?? '');
    $categoria = trim($input['categoria'] ?? '');
    $descripcion = trim($input['descripcion'] ?? '');
    $imagen_url = trim($input['imagen_url'] ?? '');
    $fecha = trim($input['fecha'] ?? date('Y-m-d'));

    if ($id <= 0 || empty($titulo) || empty($descripcion)) {
        echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE noticias SET titulo = ?, categoria = ?, descripcion = ?, imagen_url = ?, fecha = ? WHERE id = ? AND estado = 1");
        $stmt->execute([$titulo, $categoria, $descripcion, $imagen_url, $fecha, $id]);
        echo json_encode(['success' => true, 'message' => 'Noticia actualizada correctamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// ============================================================
// ELIMINAR NOTICIA (DELETE)
// ============================================================
if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(['success' => false, 'error' => 'ID inválido']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE noticias SET estado = 0 WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Noticia eliminada correctamente']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Método no permitido']);
?>