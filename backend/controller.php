<?php
    require './conexion.php';
    header('Access-Control-Allow-Origin: *');
    $conexion = new conexion();
    if (isset($_GET['view_domicilios'])) {
        $datos = $conexion->view_domicilios();
        echo json_encode($datos);
        return;
    }
    if(isset($_POST['fechaInicio'])){
        $datos      = $conexion->crear_domicilios($_POST);
        echo json_encode($datos);
        return;
    }
    