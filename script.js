document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const container = document.getElementById('desktop');
    const buzzBlock = document.getElementById("intro-window");
    const buttons = document.querySelectorAll('[id^="showButton"]');

    // Centra la primera ventana (intro) al iniciar
    centerElement(draggables[0]);
    // Añade la clase de vibración al iniciar
    buzzBlock.classList.add("buzz");

    // Remueve la clase de vibración después de un tiempo (2 segundos)
    setTimeout(() => {
        buzzBlock.classList.remove("buzz");
    }, 2000); // 2000 milisegundos = 2 segundos

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            const draggable = draggables[index];
            if (draggable) {
                if (draggable.style.display !== 'block') {
                    draggable.style.display = 'block';
                    centerElement(draggable);

                    // Texto animado from About Window
                    const textContainer = document.getElementById('animated-text');
                    let text = textContainer.innerHTML;
                    text = text.replace(/<br\s*[/]?>/gi, ' '); // Reemplaza <br> con espacios en blanco
                    textContainer.innerHTML = ''; // Limpiar el contenido original del párrafo
                    let index = 0;

                    function typeWriter() {
                        if (index < text.length) {
                            textContainer.innerHTML += text.charAt(index);
                            index++;
                            setTimeout(typeWriter, 20); // Ajusta el tiempo de espera entre cada letra
                        }
                    }

                    typeWriter();
                }
                draggable.style.zIndex = getMaxZIndex() + 1;
            }
        });
    });

    draggables.forEach(draggable => {
        draggable.addEventListener('mousedown', (event) => dragMouseDown(event, draggable));

        // Prevenir que el mousedown en el input active el arrastre del draggable
        draggable.querySelectorAll('input').forEach(input => {
            input.addEventListener('mousedown', event => {
                event.stopPropagation();
            });
        });

        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('mousedown', event => {
                event.stopPropagation();
            });
        }

        draggable.querySelectorAll('div').forEach(child => {
            if (child.id !== 'chat-input') {
                child.addEventListener('mousedown', event => {
                    event.stopPropagation();
                    dragMouseDown(event, draggable);
                });
            }
        });

    });

    function centerElement(element) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        const centerX = (containerRect.width - elementRect.width) / 2;
        const centerY = (containerRect.height - elementRect.height) / 2;

        element.style.left = centerX + 'px';
        element.style.top = centerY + 'px';
    }

    function dragMouseDown(event, element) {
        event.preventDefault();
        element.style.zIndex = getMaxZIndex() + 1;

        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            let newLeft = pageX - shiftX;
            let newTop = pageY - shiftY;

            // Limitar dentro del contenedor
            if (newLeft < containerRect.left) {
                newLeft = containerRect.left;
            } else if (newLeft + elementRect.width > containerRect.right) {
                newLeft = containerRect.right - elementRect.width;
            }

            if (newTop < containerRect.top) {
                newTop = containerRect.top;
            } else if (newTop + elementRect.height > containerRect.bottom) {
                newTop = containerRect.bottom - elementRect.height;
            }

            element.style.left = newLeft - containerRect.left + 'px';
            element.style.top = newTop - containerRect.top + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        element.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', onMouseMove);
            element.onmouseup = null;
        });

        element.addEventListener('dragstart', function() {
            return false;
        });
    }

    function getMaxZIndex() {
        let maxZ = 0;
        document.querySelectorAll('.draggable').forEach(el => {
            const zIndex = parseInt(window.getComputedStyle(el).zIndex) || 0;
            if (zIndex > maxZ) {
                maxZ = zIndex;
            }
        });
        return maxZ;
    }

    // emojis

    const emojiButton = document.getElementById('emoji-button');
    const emojiPicker = document.getElementById('emoji-picker');
    const chatInput = document.getElementById('chat-input');

    // Lista de emojis
    const emojiFiles = [
        'emoji1.gif', 'emoji2.gif', 'emoji3.gif', 'emoji4.gif', 'emoji5.gif', 'emoji6.gif',
        'emoji7.gif', 'emoji8.gif', 'emoji9.gif', 'emoji10.gif', 'emoji11.gif', 'emoji12.gif',
        'emoji13.gif', 'emoji14.gif', 'emoji15.gif', 'emoji16.gif', 'emoji17.gif', 'emoji18.gif',
        'emoji19.gif', 'emoji20.gif', 'emoji21.gif', 'emoji22.gif', 'emoji23.gif', 'emoji24.gif',
        'emoji25.gif', 'emoji26.gif', 'emoji27.gif'
    ];

    // Función para cargar emojis en el selector
    function loadEmojis() {
        emojiFiles.forEach(emoji => {
            const emojiImg = document.createElement('img');
            emojiImg.src = `assets/emojis/${emoji}`;
            emojiImg.alt = emoji;
            emojiImg.addEventListener('click', () => {
                insertEmojiIntoInput(emojiImg.src);
                emojiPicker.style.display = 'none';
            });
            emojiPicker.appendChild(emojiImg);
        });
    }

    function insertEmojiIntoInput(emojiSrc) {
        const emojiHtml = `<img src="${emojiSrc}" style="width: 24px; height: 24px;">`;
        chatInput.innerHTML += emojiHtml;
        chatInput.focus();
    }

    // Mostrar/Ocultar el selector de emojis
    emojiButton.addEventListener('click', () => {
        if (emojiPicker.style.display === 'none' || emojiPicker.style.display === '') {
            emojiPicker.style.display = 'block';
        } else {
            emojiPicker.style.display = 'none';
        }
    });

    // Cargar los emojis cuando se cargue la página
    loadEmojis();

    

});
