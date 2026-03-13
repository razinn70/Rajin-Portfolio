export class Cursor {
    el = null;
    targetX = 0;
    targetY = 0;
    currentX = 0;
    currentY = 0;
    rafId = 0;
    mounted = false;
    mount() {
        // Skip on touch devices
        if (window.matchMedia('(pointer: coarse)').matches)
            return;
        this.el = document.createElement('div');
        this.el.id = 'custom-cursor';
        Object.assign(this.el.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '1px solid rgba(255,203,164,0.6)',
            pointerEvents: 'none',
            zIndex: '9999',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border-color 0.2s ease',
            willChange: 'transform',
        });
        document.body.appendChild(this.el);
        this.mounted = true;
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        this.addHoverListeners();
        this.rafId = requestAnimationFrame(this.loop);
    }
    onMouseMove = (e) => {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
    };
    onMouseDown = () => {
        if (!this.el)
            return;
        this.el.style.transform = 'translate(-50%, -50%) scale(0.8)';
    };
    onMouseUp = () => {
        if (!this.el)
            return;
        this.el.style.transform = 'translate(-50%, -50%) scale(1)';
    };
    addHoverListeners() {
        const selector = 'a, button, .project-card, .skill-tag, .nav__resume';
        document.addEventListener('mouseover', e => {
            if (e.target.closest(selector)) {
                this.setHover(true);
            }
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(selector)) {
                this.setHover(false);
            }
        });
    }
    setHover(on) {
        if (!this.el)
            return;
        if (on) {
            this.el.style.width = '40px';
            this.el.style.height = '40px';
            this.el.style.background = 'rgba(255,203,164,0.1)';
            this.el.style.borderColor = 'rgba(255,203,164,0.9)';
        }
        else {
            this.el.style.width = '20px';
            this.el.style.height = '20px';
            this.el.style.background = 'transparent';
            this.el.style.borderColor = 'rgba(255,203,164,0.6)';
        }
    }
    loop = () => {
        if (!this.el || !this.mounted)
            return;
        this.currentX += (this.targetX - this.currentX) * 0.15;
        this.currentY += (this.targetY - this.currentY) * 0.15;
        this.el.style.left = this.currentX + 'px';
        this.el.style.top = this.currentY + 'px';
        this.rafId = requestAnimationFrame(this.loop);
    };
    dispose() {
        this.mounted = false;
        cancelAnimationFrame(this.rafId);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mouseup', this.onMouseUp);
        this.el?.remove();
    }
}
