<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET,POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Conecta a la base de datos  con usuario, contraseña y nombre de la BD
$servidor = "localhost"; $usuario = "root"; $contrasenia = ""; $nombreBaseDatos = "biblioteca";
$conexionBD = new mysqli($servidor, $usuario, $contrasenia, $nombreBaseDatos);

//Consular por Id
if (isset($_GET["consultar"])){
    $sqlusuario = mysqli_query($conexionBD,"SELECT * FROM usuarios WHERE id=".$_GET["consultar"]);
    if(mysqli_num_rows($sqlusuario) > 0){
        $sqlusuario = mysqli_fetch_all($sqlusuario,MYSQLI_ASSOC);
        echo json_encode($sqlusuario);
        exit();
    }
    else{  echo json_encode(["success"=>0]); }
}

//Consular LIBRO
if (isset($_GET["consultarL"])){
    $idlibro = mysqli_real_escape_string($conexionBD, $_GET["consultarL"]);
    $sqllibro = mysqli_query($conexionBD,"SELECT * FROM libros WHERE id='$idlibro'");
    if(mysqli_num_rows($sqllibro) > 0){
        $sqllibro = mysqli_fetch_all($sqllibro,MYSQLI_ASSOC);
        echo json_encode($sqllibro);
        exit();
    }
    else{}
}

//Consular por Correo
if (isset($_GET["consultarM"])){
    $correo = mysqli_real_escape_string($conexionBD, $_GET["consultarM"]);
    $sqlusuario = mysqli_query($conexionBD,"SELECT * FROM usuarios WHERE correo='$correo'");
    if(mysqli_num_rows($sqlusuario) > 0){
        $sqlusuario = mysqli_fetch_all($sqlusuario,MYSQLI_ASSOC);
        echo json_encode($sqlusuario);
        exit();
    }
    else{}
}

//Consular por contrasna
if (isset($_GET["consultarC"])){
    $contrasena = mysqli_real_escape_string($conexionBD, $_GET["consultarC"]);
    $sqlusuario = mysqli_query($conexionBD,"SELECT * FROM usuarios WHERE contrasena='$contrasena'");
    if(mysqli_num_rows($sqlusuario) > 0){
        $sqlusuario = mysqli_fetch_all($sqlusuario,MYSQLI_ASSOC);
        echo json_encode($sqlusuario);
        exit();
    }
    else{}
}

//Consultar por Correo y Contraseña
if (isset($_GET["consultarM"]) && isset($_GET["consultarC"])) {
    $correo = mysqli_real_escape_string($conexionBD, $_GET["consultarM"]);
    $contrasena = mysqli_real_escape_string($conexionBD, $_GET["consultarC"]);

    $sqlusuario = mysqli_query($conexionBD, "SELECT * FROM usuarios WHERE correo='$correo' AND contrasena='$contrasena'");

    if (mysqli_num_rows($sqlusuario) > 0) {
        $sqlusuario = mysqli_fetch_all($sqlusuario, MYSQLI_ASSOC);
        echo json_encode($sqlusuario);
        exit();
    } else {}
}


//Borrar por historial por Id 
if (isset($_GET["borrar"])){
    $idhistorial= mysqli_real_escape_string($conexionBD, $_GET["borrar"]);
    $sqlhistorial = mysqli_query($conexionBD,"DELETE FROM historial WHERE idhistorial=$idhistorial");
    if($sqlhistorial){
        exit();
    }
    else{   }
}

//Insertar
if(isset($_GET["insertar"])){
    $data = json_decode(file_get_contents("php://input"));

    $nombre=$data->nombre;
    $apellido=$data->apellido;
    $correo=$data->correo;
    $contrasena=$data->contrasena;
    
    if(($correo!="")&&($nombre!="")&&($apellido!="")&&($contrasena!="")){        
        $sqlusuario = mysqli_query($conexionBD,"INSERT INTO usuarios (nombre, apellido, correo, contrasena) VALUES ('$nombre', '$apellido','$correo', '$contrasena')");
        //echo json_encode(["success"=>1]);
    }
    exit();
}

//Insertar Historial
if(isset($_GET["insertarH"])){
    $data = json_decode(file_get_contents("php://input"));

    $idusuario=$data->idusuario;
    $idlibro=$data->idlibro;
    $titulo=$data->titulo;
    $estado=$data->estado;
    
    if(($idusuario!="")&&($idlibro!="")&&($titulo!="")&&($estado!="")){        
        $sqlhistorial = mysqli_query($conexionBD,"INSERT INTO historial (idusuario, idlibro, titulo, estado) VALUES ('$idusuario', '$idlibro', '$titulo','$estado')");
        //echo json_encode(["success"=>1]);
    }
    exit();
}
//Consular Historial
if (isset($_GET["consultarH"])){
    $idusuario = mysqli_real_escape_string($conexionBD, $_GET["consultarH"]);
    $sqlhistorial = mysqli_query($conexionBD,"SELECT * FROM historial WHERE idusuario='$idusuario'");
    if(mysqli_num_rows($sqlhistorial) > 0){
        $sqlhistorial = mysqli_fetch_all($sqlhistorial,MYSQLI_ASSOC);
        echo json_encode($sqlhistorial);
        exit();
    }
    else{}
}

//Actualizar
if(isset($_GET["actualizar"])){
    
    $data = json_decode(file_get_contents("php://input"));

    $id=(isset($data->id))?$data->id:$_GET["actualizar"];
    $nombre=$data->nombre;
    $apellido=$data->apellido;
    $correo=$data->correo;
    $contrasena=$data->contrasena;
    
    $sqlusuario = mysqli_query($conexionBD,"UPDATE usuarios SET nombre='$nombre', apellido='$apellido', correo='$correo', contrasena='$contrasena' WHERE id='$id'");
    echo json_encode(["success"=>1]);
    exit();
}
/*
$sqlusuario = mysqli_query($conexionBD,"SELECT * FROM usuarios ");
if(mysqli_num_rows($sqlusuario) > 0){
    $sqlusuario = mysqli_fetch_all($sqlusuario,MYSQLI_ASSOC);
    echo json_encode($sqlusuario);
}
else{ echo json_encode([["success"=>0]]); }
*/

if(isset($_GET["libros"])){
    $sqllibro = mysqli_query($conexionBD,"SELECT * FROM libros");
    if(mysqli_num_rows($sqllibro) > 0){
        $sqllibro = mysqli_fetch_all($sqllibro,MYSQLI_ASSOC);
        echo json_encode($sqllibro, JSON_UNESCAPED_SLASHES);
    }
    else{ echo json_encode([["success"=>0]]); }
}


?>
