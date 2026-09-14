<?php
// ============================================================
// CERRAR SESIÓN
// ============================================================

session_start();

// Eliminar todas las variables de sesión
$_SESSION = array();

// Destruir la sesión
session_destroy();

// Eliminar cookies de "Recordarme"
setcookie('user_id', '', time() - 3600, '/');
setcookie('user_name', '', time() - 3600, '/');

// Redirigir al login
header('Location: ../HTML/acceso-cliente.html');
exit;
?>