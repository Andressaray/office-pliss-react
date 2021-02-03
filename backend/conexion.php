<?php
    class conexion{
        private $conexionBD;
        public $error   = array();
        public $results = array();
        function __construct(){
            $this->conexion();
        }

        function conexion(){
            $server     = 'localhost';
            $bd         = 'office_pliss';
            $password   = '1007';
            $user       = 'root';
            $this->conexionBD = new mysqli($server, $user, $password, $bd);
            if($this->conexionBD->connect_errno){
                $this->error = array (
                    'status'    => 'error',
                    'message'   => 'Error, no se pudo conectar' . mysqli_connect_errno()
                );
                return $this->error;
                exit();
            }
        }
        
        function view_domicilios(){
            $stmt = $this->conexionBD->prepare("SELECT * FROM domicilios");
            $stmt->execute();
            $result     = $stmt->get_result();
            if($result->num_rows < 1){
                $this->error = array(
                    'status'    => 'error',
                    'message'   => 'Error no se encontrarón datos'
                );
                return $this->error;
                exit();
            }else{
                while ($row = $result->fetch_assoc()) {
                    $this->results[] = $row;
                }
                $stmt->close();
                $this->conexionBD->close();
                return $this->results;
            }
        }

        function crear_domicilios($newDomicilio){
            $stmt = $this->conexionBD->prepare("INSERT INTO domicilios (
                fecha_domicilio,
                hora_i,
                hora_f,
                recargos,
                valor_base,
                valor_total,
                descripcion
            ) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param('sssiiis',
                $newDomicilio['fecha_domicilio'],
                $newDomicilio['hora_i'],
                $newDomicilio['hora_f'],
                $newDomicilio['cantidadRecargos'],
                $newDomicilio['valor_base'],
                $newDomicilio['valor_total'],
                $newDomicilio['descripcion']
            );
            $stmt->execute();
            $stmt->close();
            $this->conexionBD->close();
            $this->results = array(
                'response'  => 'success',
                'text'      => 'Domicilio guardado con exito',
                'body'      => 'Lo hicimos bro'
            );
            return $this->results;
        }

    }