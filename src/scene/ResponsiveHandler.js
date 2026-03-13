export class ResponsiveHandler {
    renderer;
    camera;
    debounceTimer = null;
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        window.addEventListener('resize', this.onResize);
        // Fire once to set initial state
        this.applyResize();
    }
    onResize = () => {
        if (this.debounceTimer !== null)
            clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.applyResize(), 150);
    };
    applyResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        if (w < 768) {
            window.dispatchEvent(new CustomEvent('scene-mobile-mode'));
        }
        else {
            window.dispatchEvent(new CustomEvent('scene-desktop-mode'));
        }
    }
    dispose() {
        window.removeEventListener('resize', this.onResize);
        if (this.debounceTimer !== null)
            clearTimeout(this.debounceTimer);
    }
}
