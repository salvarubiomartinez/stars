<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

//borramos la estrella con el id recibido
$id = $_REQUEST['id'];
unlink("./database/$id");
echo $id;
