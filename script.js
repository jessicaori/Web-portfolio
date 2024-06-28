document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const container = document.getElementById('desktop');
    const buzzBlock = document.getElementById("intro-window");
    const buttons = document.querySelectorAll('[id^="showButton"]');

    // Centra la primera ventana (intro) al iniciar
    centerElement(draggables[0]);
    buzz("intro-window");

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const indexWindow = button.getAttribute('data-index');
            const draggable = draggables[indexWindow];
            if (draggable) {
                if (draggable.style.display !== 'block') {
                    draggable.style.display = 'block';
                    if(indexWindow == 7){
                        draggable.style.bottom = '60px';
                    }else{
                        centerElement(draggable);
                    }
                    // Animación abrir ventana
                    draggable.classList.add("opened");
                    setTimeout(() => {
                        draggable.classList.remove("opened");
                    }, 200);
                    
                    if(indexWindow == 1){
                        // Texto animado
                        const textContainer = document.getElementById('animated-text');
                        let text = textContainer.innerHTML;
                        text = text.replace(/<br\s*[/]?>/gi, ' '); // Reemplaza <br> con espacios en blanco
                        textContainer.innerHTML = ''; // Limpiar el contenido original del párrafo
                        let textIndex = 0;
        
                        function typeWriter() {
                            if (textIndex < text.length) {
                                textContainer.innerHTML += text.charAt(textIndex);
                                textIndex++;
                                setTimeout(typeWriter, 20); // Ajusta el tiempo de espera entre cada letra
                            }
                        }
        
                        typeWriter();
                    }
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

        const stickynotebody = document.getElementById('sticky-note-body');
        if (stickynotebody) {
            stickynotebody.addEventListener('mousedown', event => {
                event.stopPropagation();
            });
        }

        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('mousedown', event => {
                event.stopPropagation();
            });
        }

        const buttonAbout = document.getElementById('showAboutWindow');
        if (buttonAbout) {
            buttonAbout.addEventListener('mousedown', event => {
                event.stopPropagation();
            });
        }

        draggable.querySelectorAll('div').forEach(child => {
            if (child.id !== 'chat-input' && child.id !== 'sticky-note-body') {
                child.addEventListener('mousedown', event => {
                    event.stopPropagation();
                    dragMouseDown(event, draggable);
                });
            }
        });
    });

    const buttonAbout = document.getElementById('showAboutWindow');
    const draggableAbout = draggables[1];
    if (buttonAbout) {
        buttonAbout.addEventListener('click', () => {
            if (draggableAbout.style.display !== 'block') {
                draggableAbout.style.display = 'block';
                centerElement(draggableAbout);
                // Texto animado
                const textContainer = document.getElementById('animated-text');
                let text = textContainer.innerHTML;
                text = text.replace(/<br\s*[/]?>/gi, ' '); // Reemplaza <br> con espacios en blanco
                textContainer.innerHTML = ''; // Limpiar el contenido original del párrafo
                let index2 = 0;

                function typeWriter() {
                    if (index2 < text.length) {
                        textContainer.innerHTML += text.charAt(index2);
                        index2++;
                        setTimeout(typeWriter, 20); // Ajusta el tiempo de espera entre cada letra
                    }
                }

                typeWriter();
            }
            draggableAbout.style.zIndex = getMaxZIndex() + 1;
        });
    }

    // Para cerrar cada ventana
    const closebuttons = document.querySelectorAll('[id^="closebutton"]');
    closebuttons.forEach(button => {
        button.addEventListener('click', () => {
            const indexWindow = button.getAttribute('data-index');
            const draggable = draggables[indexWindow];
            if (draggable) {
                if (draggable.style.display == 'block') {
                    draggable.classList.add("closed");
                    setTimeout(() => {
                        draggable.classList.remove("closed");
                        draggable.style.display = 'none';
                    }, 200);
                }
            }
        });
        button.addEventListener('mousedown', event => {
            event.stopPropagation();
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

    function buzz(element){
        const buzzBlock = document.getElementById(element);
        buzzBlock.classList.add("buzz");
        setTimeout(() => {
            buzzBlock.classList.remove("buzz");
        }, 2000);
    }

    const buzzButton = document.getElementById('buzz-button');
    buzzButton.addEventListener("click", function () {
        buzz("about-window");
    });

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

    // Descargar CV
    const downloadBtn = document.getElementById('download-cv');
        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = './assets/documents/CV-JessicaOrihuelaRojas.pdf';
            link.download = 'CV - Jessica Orihuela Rojas';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    // Cerrar ventana de descarga
    const notdownloadBtn = document.getElementById('dont-download-cv');
    const draggableCV = draggables[4];
    notdownloadBtn.addEventListener('click', () => {
        draggableCV.style.display = 'none';
    });

    // Music Player
    var audioPlayer = document.getElementById("audioPlayer");
    var volumeControl = document.getElementById("volumeControl");
    var prevButton = document.getElementById("prevButton");
    var nextButton = document.getElementById("nextButton");
    var stopButton = document.getElementById("stopButton");
    var playButton = document.getElementById("playButton");
    var pauseButton = document.getElementById("pauseButton");
    var songImage = document.getElementById("songImage");
    var songName = document.getElementById("songName");
    var songDuration = document.getElementById("songDuration");
    var volumeOn = document.getElementById("volume-on");
    var volumeMute = document.getElementById("volume-mute");

    var playlist = [
        {
            src: './assets/audio/3 Stars.mp3',
            name: '3 Stars',
            image: './assets/img/music-player/3 Stars.png'
        },
        {
            src: './assets/audio/aquatic ambience.mp3',
            name: 'Aquatic Ambience',
            image: './assets/img/music-player/aquatic ambience.png'
        },
        {
            src: './assets/audio/LEASE.mp3',
            name: 'LEASE',
            image: './assets/img/music-player/default.png'
        },
        {
            src: './assets/audio/Lucid Memories.mp3',
            name: 'Lucid Memories',
            image: './assets/img/music-player/Lucid Memories.png'
        },
        {
            src: './assets/audio/Wii Party (Main Menu).mp3',
            name: 'Wii Party (Main Menu)',
            image: './assets/img/music-player/Wii Party (Main Menu).png'
        },
        {
            src: './assets/audio/ファックラブ.mp3',
            name: 'ファックラブ',
            image: './assets/img/music-player/default.png'
        }
    ];

    var currentTrack = 0;

    function loadTrack(index1) {
        if (index1 >= 0 && index1 < playlist.length) {
            audioPlayer.src = playlist[index1].src;
            songName.textContent = playlist[index1].name;
            songImage.src = playlist[index1].image;
            audioPlayer.play();
        }
    }

    function playTrack() {
        audioPlayer.play();
    }

    function updateDuration() {
        var currentMinutes = Math.floor(audioPlayer.currentTime / 60);
        var currentSeconds = Math.floor(audioPlayer.currentTime % 60);

        if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
        songDuration.textContent = `${currentMinutes}:${currentSeconds}`;
    }

    audioPlayer.addEventListener("ended", function() {
        currentTrack++;
        if (currentTrack >= playlist.length) {
            currentTrack = 0; // Reiniciar al comienzo de la lista
        }
        loadTrack(currentTrack);
        playTrack();
    });

    audioPlayer.addEventListener("timeupdate", updateDuration);

    volumeControl.addEventListener("input", function() {
        audioPlayer.muted = false;
        volumeOn.style.display = 'block';
        volumeMute.style.display = 'none';
        audioPlayer.volume = volumeControl.value;
    });

    prevButton.addEventListener("click", function() {
        if (currentTrack > 0) {
            currentTrack--;
        } else {
            currentTrack = playlist.length - 1;
        }
        loadTrack(currentTrack);
        playTrack();
        playButton.style.display = 'none';
        pauseButton.style.display = 'flex';
    });

    nextButton.addEventListener("click", function() {
        currentTrack++;
        if (currentTrack >= playlist.length) {
            currentTrack = 0; // Reiniciar al comienzo de la lista
        }
        loadTrack(currentTrack);
        playTrack();
        playButton.style.display = 'none';
        pauseButton.style.display = 'flex';
    });

    stopButton.addEventListener("click", function() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        pauseButton.style.display = 'none';
        playButton.style.display = 'flex';
    });

    playButton.addEventListener("click", function() {
        if (audioPlayer.src === '') {
            loadTrack(currentTrack);
        }
        playTrack();
        playButton.style.display = 'none';
        pauseButton.style.display = 'flex';
    });

    pauseButton.addEventListener("click", function() {
        audioPlayer.pause();
        pauseButton.style.display = 'none';
        playButton.style.display = 'flex';
    });

    // Cargar la primera pista al cargar la página
    loadTrack(currentTrack);

    volumeOn.addEventListener("click", function() {
        volumeOn.style.display = 'none';
        volumeMute.style.display = 'block';
        audioPlayer.muted = true;
        volumeControl.value = "0";
    });

    volumeMute.addEventListener("click", function () {
        volumeOn.style.display = 'block';
        volumeMute.style.display = 'none';
        audioPlayer.muted = false;
    });

    // Sticky notes
    
    document.querySelector("#container").addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains("add-note")) {
            addStickyNote();
        } else if (event.target && event.target.classList.contains("remove-note")) {
            removeStickyNote(event.target);
        }
    });

    function addStickyNote() {
        const container = document.getElementById("container");
        const newStickyNote = document.querySelector(".sticky-note").cloneNode(true);
        container.appendChild(newStickyNote);
    }

    function removeStickyNote(button) {
        const stickyNote = button.closest(".sticky-note");
        stickyNote.remove();
    }

    // Hora actual en la barra de tareas

    function updateTime() {
        const now = new Date();
        const clockElement = document.getElementById('clock');
        const dateElement = document.getElementById('date');
        
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        dateElement.textContent = `${day}/${month}/${year}`;
    }
    
    // Update time every second
    setInterval(updateTime, 1000);
    
    // Initial call to display time immediately
    updateTime();
    
});
