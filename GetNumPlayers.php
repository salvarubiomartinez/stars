<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'Serializer.php';
require_once 'Star.php';

//contamos todas las estrellas de tipo player y devolvemos su numero
$respon = 0;
$arrId = Serializer::showIds();
foreach ($arrId as $arr) {
    $obj = Serializer::restore($arr);
    if ($obj->type == "player") {
        $respon++;
    }
}
echo $respon;
