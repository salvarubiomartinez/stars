<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'Serializer.php';
require_once 'Star.php';

//Actualizamos al estrella recibida
$starString = $_REQUEST['star'];
$obj = json_decode($starString);
$star = new Star($obj->id, $obj->posX, $obj->posY, $obj->size, $obj->type, $obj->playerName);
Serializer::save($star, $star->id);

//devolvemos un array con todas las estrellas
$arrId = Serializer::showIds();
$arrId = array_filter($arrId);
asort($arrId);
$respon = array();
foreach ($arrId as $arr) {
    $obj = Serializer::restore($arr);
    array_push($respon, $obj);
}
$json = json_encode($respon);
echo $json;
