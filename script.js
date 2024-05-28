function reproducirAudio() {
    var audio = document.getElementById('miAudio');
    audio.play();
}

function dragElement(el) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Obtiene la posición del cursor al inicio del arrastre
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calcula la nueva posición del cursor
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Establece la nueva posición del elemento
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Detiene el movimiento cuando se suelta el mouse
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Llama a la función para hacer el elemento arrastrable
dragElement(document.getElementById("draggable"));