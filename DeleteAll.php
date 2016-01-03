<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'Serializer.php';

//borramos todas las estrellas guardadas
$arrId = Serializer::showIds();
$arrId = array_filter($arrId);
asort($arrId);
$respon = array();
foreach ($arrId as $arr) {
    echo unlink("./database/$arr");
}