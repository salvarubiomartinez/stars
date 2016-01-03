//el jugador
var player;
// dos variables para guardar el settimeout y al finalizar poder pararlo
var endGame;
var endCreateRandomStar;
//una cache de las estrellas eliminadas
var deadStarCacheId = [];

//La función que genera los objetos estella
function Star(size, type) {
    this.id;
    this.posX = Math.floor(Math.random() * window.innerWidth);
    this.posY = Math.floor(Math.random() * window.innerHeight);
    this.size = size;
    this.type = type;
    this.left = true;
    this.top = true;
    this.playerName = null;
}

//El control del jugador basado en la posición del puntero, establece la dirección del jugador
function mousedown(elEvento) {
    var esdeveniment = elEvento || window.event;
    var screenX = esdeveniment.clientX;
    var screenY = esdeveniment.clientY;
    console.log('mouse:' + screenX + ',' + screenY);
    console.log('player:' + player.posX + ',' + player.posY);

    if (screenX < player.posX) {
        player.left = true;
    }
    ;
    if (screenX > player.posX) {
        player.left = false;
    }
    ;
    if (screenY < player.posY) {
        player.top = true;
    }
    ;
    if (screenY > player.posY) {
        player.top = false;
    }
    ;
}

//Recibimos el número de jugadores antes de crear el nuevo, si es superior a 10 no se permite jugar,
//de lo contrario se crea el jugador
function CheckNumberPLayers() {
    var url = "GetNumPlayers.php";
    var params = "";
    var callBack = function (data) {
        if (data < 10) {
            //Si no hay jugadores borramos todas las esteallas y regeneramos el escenario
            if (data == 0) {
                DeleteAll();
                newGame();
            }
            window.setTimeout(CreatePlayer, 1000);
        } else {
            document.getElementById('table').innerHTML = "Lo siento pero se alcanzado el límite máximo de jugadores. Inténtalo más tarde...";
        }
    };
    send(url, params, callBack);
}

//generamos un escenario con 20 estrellas
function newGame() {
    var numberOfStars = 20;
    var type = true;
    for (var i = 0; i < numberOfStars; i++) {
        var size = 5 + Math.floor(Math.random() * 30);
        var star = new Star(size, (type) ? "red" : "orange");
        Create(star);
        type = !type;
    }
}
;

//Creamos el jugador
function CreatePlayer() {
    player = new Star(10, "player");
    var url = "Create.php";
    var star = JSON.stringify(player);
    var params = 'star=' + star;
    var playerName = window.prompt("Nombre de jugaor?");
    player.playerName = playerName != null ? playerName : "Desconocido";
    var callBack = function (data) {
        player.id = parseInt(data);
        console.log("CreatePlayer: id: " + data);
        window.setTimeout(CheckFirstPlayer, 1000);
    };
    send(url, params, callBack);
}
;
//Chequeamos si es el primero, si lo es entramos en bucle hasta que llegue otro, si no comienza el juego
function CheckFirstPlayer() {
    var url = "GetNumPlayers.php";
    var params = "";
    var callBack = function (data) {
        if (data > 1) {
            window.setTimeout(move, 100);
            window.setTimeout(CreateRandomStar, 1000);
            return true;
        }
        ;
        document.getElementById('table').innerHTML = "Esperando otro jugador...";
        window.setTimeout(CheckFirstPlayer, 1000);
    };
    send(url, params, callBack);
}
;

//vamos generando estrellas cada 5 segundos
function CreateRandomStar() {
    var size = 5 + Math.floor(Math.random() * 30);
    var type = Math.floor(Math.random() * 10);
    var star = new Star(size, (type > 4) ? "red" : "orange");
    Create(star);
    endCreateRandomStar = setTimeout(CreateRandomStar, 5000);
}

//Función para generar una estrella
function Create(star) {
    var url = "Create.php";
    star = JSON.stringify(star);
    var params = 'star=' + star;
    var print = function (data) {
        console.log("Create :" + parseInt(data));
    };
    send(url, params, print);
}

//Movemos el jugador en un loop si fin
function move() {
       //en función del tamaño establecemos su velocidad
    var speed;
    if (player.size > 150){
        speed = 1;
    } else if (player.size > 75){
        speed = 2;
    } else {
        speed = 3;
    }

    //en función de la dirección se establece la nueva posición
    if (player.left) {
    player.posX = player.posX + speed;
    } else {
        player.posX = player.posX - speed;
    }
    if (player.top) {
        player.posY = player.posY + speed;
    } else {
        player.posY = player.posY - speed;
    }

    //limites de la pantalla para que rebote
    if (player.posX > (window.innerWidth - (player.size / 2))) {
        player.left = false;
    }
    if (player.posX < 0 + (player.size / 2)) {
        player.left = true;
    }
    if (player.posY > (window.innerHeight - (player.size / 2))) {
        player.top = false;
    }
    if (player.posY < 0 + (player.size / 2)) {
        player.top = true;
        ;
    }
    //salvamos la nueva posición
    Save(player);
    //repetimos el ciclo
    endGame = setTimeout(move, 50);
}

//función para guardar una estrella. En la respuesta dibujamos todas las estrellas
function Save(star) {
    var url = "Save.php";
    star = JSON.stringify(star);
    var params = 'star=' + star;
    var callback = function (data) {
        //console.log("Save :" + data);
        display(data);
    };
    send(url, params, callback);
}

//función para borrar una estella
function Delete(id) {
    var url = "Delete.php";
    var params = 'id=' + id;
    var callback = function (data) {
        console.log("Delete :" + data);
    };
    send(url, params, callback);
}

//función para borrar todas las estrellas
function DeleteAll() {
    var url = "DeleteAll.php";
    var params = "";
    var callback = function (data) {
        console.log("Delete :" + data);
    };
    send(url, params, callback);
}

//función generica para hacer conexiones con AJAX
function send(url, params, callback) {
    var datos = new XMLHttpRequest();
    datos.open("POST", url, true);
    datos.onreadystatechange = function () {
        if (datos.readyState == 4 && datos.status == 200) {
            callback(datos.responseText);
        }
        ;
    };
    datos.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    datos.send(params);
}

//dibujamos todas las estrellas
function display(data) {
    //convertimos el json a objeto
    var stars = JSON.parse(data);
    //borramos el dibujo anterior
    document.getElementById('table').innerHTML = "";
    //recorremos el array de estrellas
    for (var star in stars) {
        //creamos un div para cada estrella
        var div = document.createElement("div");
        //si la estrella no es de tipo de jugador se verifica que no haya choque
        if (stars[star].type != 'player') {
            crash(stars[star]);
        } else {
            //si es jugador se dibuja su nombre
            var contenido = document.createTextNode(stars[star].playerName);
            div.appendChild(contenido);
        }
        //se dibuja la estrella en s posición y con su color
        div.setAttribute("class", "star " + stars[star].type);
        document.getElementById('table').appendChild(div);
        var posX = stars[star].posX - (stars[star].size / 2);
        var posY = stars[star].posY - (stars[star].size / 2);
        div.style.left = posX + 'px';
        div.style.top = posY + 'px';
        div.style.width = stars[star].size + 'px';
        div.style.height = stars[star].size + 'px';
        div.style.background = (stars[star].id == player.id) ? 'green' : stars[star].type;

    }
}

//Verificamos si hay colisión de estrellas
function crash(star) {
    //calculamos la distancia entre centros y los radios del jugador y la estrella
    var playerRadius = player.size / 2;
    var starRadius = star.size / 2;
    var distance = parseInt(Math.sqrt((Math.pow((player.posX - star.posX), 2) + Math.pow((player.posY - star.posY), 2))));
    //verificamos que la estrella no este en la cache de estrellas muertas
    var dead = false;
    for (var index in deadStarCacheId) {
        if (deadStarCacheId[index] == star.id) {
            dead = true;
        }
        ;
    }
    ;
    // si la suma de los radios es mayor que la distancia entre centros hay colisión
    if (distance < (playerRadius + starRadius) && !dead)
    {
        console.log('choque: player(' + player.posX + ',' + player.posY + '),star(' + star.posX + ',' + star.posY + ')');
        //añadimos la estrella al array de estrellas muertas
        deadStarCacheId.push(star.id);
        sonidoTocado();
        // si la estrella es de tipo rojo aumenta el tamaño del jugador
        if (star.type == 'red') {
            Delete(star.id);
            player.size = player.size + star.size;
            //Si el jugador llega al tamaño máximo gana el juego
            if (player.size > 225) {
                clearTimeout(endGame);
                if (undefined != endCreateRandomStar) {
                    clearTimeout(endCreateRandomStar);
                }
                document.getElementById('table').innerHTML = "";
                Delete(player.id);
                DeleteAll();
                alert(player.playerName + ' has ganado!');

            }
        }
        //Si es naranja el jugador pierde tamaño
        if (star.type == 'orange') {
            Delete(star.id);
            //si llega al mínimo muere
            if (player.size - star.size < 1) {
                clearTimeout(endGame);
                if (undefined != endCreateRandomStar) {
                    clearTimeout(endCreateRandomStar);
                }
                document.getElementById('table').innerHTML = "";
                Delete(player.id);
                alert('muerto');
                document.getElementById('table').innerHTML = "";
            } else {
                player.size = player.size - star.size;
            }
        }
    }
}


//sonido de choque
function sonidoTocado() {
    var snd = new Audio("126415__cabeeno-rossley__enemy-emerge.wav");
    snd.play();
}

//la entrada a la aplicaición
window.onload = function () {
    CheckNumberPLayers();
    document.onmousedown = mousedown;
};

//si el jugador sale del juego lo borramos y cerramos los loops
window.onbeforeunload = function (e) {
    e = e || window.event;
    clearTimeout(endGame);
    clearTimeout(endCreateRandomStar);
    Delete(player.id);
    if (e) {
        e.returnValue = "adiós";
    }
    return "adios";
};
