<?php
header('Content-Type: application/json');

// ELIMINA el "tcp://" del host
$host = "db.lacolo.site"; 
$port = "5433";
$dbname = "casaos";
$user = "casaos";
$password = "casaos";

// La cadena de conexión debe ser limpia
$db_info = "host=$host port=$port dbname=$dbname user=$user password=$password";

// Intentar la conexión
$dbconn = @pg_connect($db_info);

if (!$dbconn) {
    // Si falla, enviamos el error para que JS lo capture
    http_response_code(500);
    echo json_encode([
        "error" => "Error de conexión al servidor remoto",
        "detalle" => "Asegúrate de que el puerto 5433 esté abierto y el túnel activo."
    ]);
    exit;
}

// ... resto de tu código ...
$query = 'SELECT nombre, descripcion, precio, stock, url_imagen FROM productos';
$result = pg_query($dbconn, $query);

if (!$result) {
    echo json_encode(["error" => "Error en la consulta SQL"]);
    exit;
}

$productos = pg_fetch_all($result) ?: [];
echo json_encode($productos);
pg_close($dbconn);
?>