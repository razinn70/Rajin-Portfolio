// --- Styles (must be first) ---
import '@/styles/global.css';
import '@/styles/animations.css';
import '@/styles/navigation.css';
import '@/styles/projects.css';
import '@/styles/about.css';
import '@/styles/contact.css';
import '@/styles/responsive.css';
// --- Scene ---
import { SceneManager } from '@/scene/SceneManager';
import { CameraController } from '@/scene/CameraController';
import { ResponsiveHandler } from '@/scene/ResponsiveHandler';
// --- Computer ---
import { ComputerModel } from '@/computer/ComputerModel';
import { ScreenRenderer } from '@/computer/ScreenRenderer';
// --- Terminal ---
import { Shell } from '@/terminal/Shell';
// --- UI ---
import { LoadingScreen } from '@/ui/LoadingScreen';
import { Cursor } from '@/ui/Cursor';
import { Navigation } from '@/ui/Navigation';
import { ProjectCards } from '@/ui/ProjectCards';
import { AboutSection } from '@/ui/AboutSection';
import { ContactSection } from '@/ui/ContactSection';
// --- Personal ---
import { personal } from '@/data/personal';
function hasWebGL() {
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
    }
    catch {
        return false;
    }
}
function mountMobileHero() {
    const hero = document.createElement('div');
    hero.className = 'mobile-hero';
    hero.innerHTML = `
    <h1 class="mobile-hero__name">${personal.name}</h1>
    <p class="mobile-hero__tagline">${personal.tagline}</p>
    <div class="mobile-hero__cta">
      <a href="#projects" class="btn-primary">See My Work</a>
      <a href="${personal.resumePath}" download class="btn-primary">Resume</a>
    </div>
  `;
    const main = document.getElementById('main-content');
    main?.prepend(hero);
}
async function init() {
    // 1. Loading screen (shown immediately)
    const loading = new LoadingScreen();
    loading.show();
    // 2. Cursor
    const cursor = new Cursor();
    cursor.mount();
    // 3. Navigation
    const nav = new Navigation();
    nav.mount();
    // 4. Wire UI sections (content sections below the hero)
    const projectsEl = document.getElementById('projects');
    const aboutEl = document.getElementById('about');
    const contactEl = document.getElementById('contact');
    if (projectsEl)
        new ProjectCards(projectsEl).mount();
    if (aboutEl)
        new AboutSection(aboutEl).mount();
    if (contactEl)
        new ContactSection(contactEl).mount();
    // 5. WebGL check — skip 3D on unsupported browsers
    if (!hasWebGL()) {
        mountMobileHero();
        await loading.hide();
        return;
    }
    // 6. THREE.js scene
    const sceneManager = new SceneManager();
    const computer = new ComputerModel(sceneManager.scene);
    sceneManager.scene.add(computer.group);
    // 7. Terminal shell + screen renderer
    const shell = new Shell();
    const screenRenderer = new ScreenRenderer(shell);
    // Attach CRT material to the screen plane once texture is ready
    computer.attachCRTMaterial(screenRenderer.canvasTexture);
    // 8. Keyboard input: route to shell when terminal is active
    let terminalActive = false;
    window.addEventListener('crt-screen-visible', () => {
        terminalActive = true;
    });
    document.addEventListener('keydown', e => {
        if (!terminalActive)
            return;
        shell.handleKeydown(e);
    });
    // 9. Camera controller + responsive handler
    const cameraController = new CameraController(sceneManager.camera);
    new ResponsiveHandler(sceneManager.renderer, sceneManager.camera);
    // 10. Start render loop
    sceneManager.start((delta, elapsed) => {
        void delta;
        cameraController.update();
        screenRenderer.update(elapsed * 1000);
        computer.updateShaderTime(elapsed);
    });
    // 11. Hide loading screen after a short delay
    setTimeout(async () => {
        await loading.hide();
    }, 1800);
}
init().catch(console.error);
