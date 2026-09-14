<?php
// ============================================================
// PROCESAR LOGIN - Conexión con base de datos
// ============================================================

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'infoactiva_db';
$username = 'root';
$password = '';

// Iniciar sesión
session_start();

// Verificar si se envió el formulario por POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Obtener datos del formulario
    $usuario = trim($_POST['usuario'] ?? '');
    $password_input = trim($_POST['password'] ?? '');

    // Validar que los campos no estén vacíos
    if (empty($usuario) || empty($password_input)) {
        header('Location: ../HTML/acceso-cliente.html?error=empty');
        exit;
    }

    try {
        // Conexión a la base de datos
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Buscar usuario en la base de datos
        $stmt = $pdo->prepare("SELECT id, usuario, password, nombre, email, rol FROM clientes WHERE usuario = :usuario AND estado = 1");
        $stmt->execute(['usuario' => $usuario]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Verificar si el usuario existe y la contraseña es correcta
        if ($user && password_verify($password_input, $user['password'])) {

            // Guardar datos del usuario en la sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nombre'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_rol'] = $user['rol'];
            $_SESSION['logged_in'] = true;

            // Redirección según el rol
            if ($user['rol'] === 'admin') {
                header('Location: ../HTML/admin-noticias.html');
            } else {
                header('Location: ../HTML/noticias-publicas.html');
            }
            exit;

        } else {
            // Credenciales incorrectas
            header('Location: ../HTML/acceso-cliente.html?error=invalid');
            exit;
        }

    } catch (PDOException $e) {
        // Error de base de datos
        error_log('Error de login: ' . $e->getMessage());
        header('Location: ../HTML/acceso-cliente.html?error=db');
        exit;
    }

} else {
    // Si se accede directamente al archivo sin POST
    header('Location: ../HTML/acceso-cliente.html');
    exit;
}
?>