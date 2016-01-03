<?php

// la clase estrella
class Star {

    var $id;
    var $posX;
    var $posY;
    var $size;
    var $type;
    var $playerName;

    public function __construct($id, $posX, $posY, $size, $type, $playerName) {
        $this->id = $id;
        $this->posX = $posX;
        $this->posY = $posY;
        $this->size = $size;
        $this->type = $type;
        $this->playerName = $playerName;
    }

}
