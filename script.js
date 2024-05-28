document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const container = document.getElementById('desktop');

    draggables.forEach(draggable => {
        draggable.addEventListener('mousedown', (event) => dragMouseDown(event, draggable));

        draggable.querySelectorAll('div').forEach(child => {
            child.addEventListener('mousedown', event => {
                event.stopPropagation();
                dragMouseDown(event, draggable);
            });
        });
    });

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
});
