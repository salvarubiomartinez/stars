<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'Serializer.php';
require_once 'Star.php';

//Creamos una estrella con un id generado a partir de la hora en milisegundos y la guardamos
$starString = $_REQUEST['star'];
$id = microtime(true) * 10000;
$obj = json_decode($starString);
$star = new Star($id, $obj->posX, $obj->posY, $obj->size, $obj->type, $obj->playerName);
Serializer::save($star, $star->id);
echo $star->id;
