import * as THREE from 'three';
const CANVAS_W = 512;
const CANVAS_H = 384;
const FONT_SIZE = 14;
const LINE_HEIGHT = 20;
const PADDING = 16;
const MAX_LINES = Math.floor((CANVAS_H - PADDING * 2) / LINE_HEIGHT);
const COLOR_BG = '#050f0a';
const COLOR_TEXT = '#c8ffc8';
const COLOR_DIM = '#5a8a5a';
const COLOR_PROMPT = '#ffcba4';
const COLOR_CURSOR = '#ffcba4';
const BOOT_LINES = [
    'BIOS 2.0 — rajinuddin.dev',
    'Checking system................ OK',
    'Loading THREE.js scene......... OK',
    'Mounting virtual filesystem.... OK',
    'Starting terminal.............. OK',
    '',
    'Type "help" to begin.',
    '',
];
export class ScreenRenderer {
    canvasTexture;
    canvas;
    ctx;
    shell;
    dirty = true;
    fontsReady = false;
    screenVisible = false;
    bootDone = false;
    bootLines = [];
    cursorVisible = true;
    lastCursorToggle = 0;
    constructor(shell) {
        this.shell = shell;
        this.canvas = document.createElement('canvas');
        this.canvas.width = CANVAS_W;
        this.canvas.height = CANVAS_H;
        this.ctx = this.canvas.getContext('2d');
        this.canvasTexture = new THREE.CanvasTexture(this.canvas);
        this.canvasTexture.minFilter = THREE.LinearFilter;
        this.canvasTexture.magFilter = THREE.LinearFilter;
        // Listen for shell output changes
        this.shell.addEventListener('terminal-output-changed', () => {
            this.dirty = true;
        });
        // Show full terminal when camera zooms in
        window.addEventListener('crt-screen-visible', () => {
            this.screenVisible = true;
            this.dirty = true;
        });
        // Pre-load font then start boot sequence
        document.fonts.load(`${FONT_SIZE}px "JetBrains Mono"`).then(() => {
            this.fontsReady = true;
            this.startBoot();
        }).catch(() => {
            this.fontsReady = true;
            this.startBoot();
        });
    }
    startBoot() {
        this.bootLines = [];
        const addLine = (i) => {
            if (i >= BOOT_LINES.length) {
                this.bootDone = true;
                this.dirty = true;
                return;
            }
            this.bootLines.push(BOOT_LINES[i]);
            this.dirty = true;
            setTimeout(() => addLine(i + 1), i === 0 ? 200 : 180);
        };
        addLine(0);
    }
    update(now) {
        if (!this.fontsReady)
            return;
        // Cursor blink every 530ms
        if (now - this.lastCursorToggle > 530) {
            this.cursorVisible = !this.cursorVisible;
            this.lastCursorToggle = now;
            this.dirty = true;
        }
        if (!this.dirty)
            return;
        this.dirty = false;
        this.draw();
        this.canvasTexture.needsUpdate = true;
    }
    draw() {
        const ctx = this.ctx;
        // Background
        ctx.fillStyle = COLOR_BG;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        // Subtle green gradient overlay (CRT phosphor warmth)
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        grad.addColorStop(0, 'rgba(0,255,128,0.04)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
        ctx.textBaseline = 'top';
        if (!this.bootDone) {
            this.drawBootLines();
        }
        else if (this.screenVisible) {
            this.drawTerminal();
        }
        else {
            this.drawBootLines();
        }
    }
    drawBootLines() {
        const ctx = this.ctx;
        let y = PADDING;
        for (const line of this.bootLines) {
            ctx.fillStyle = line.startsWith('BIOS') ? COLOR_PROMPT : COLOR_DIM;
            ctx.fillText(line, PADDING, y);
            y += LINE_HEIGHT;
        }
        // Blinking cursor on last line if boot not done
        if (!this.bootDone && this.cursorVisible) {
            ctx.fillStyle = COLOR_CURSOR;
            ctx.fillRect(PADDING, y, 8, FONT_SIZE);
        }
    }
    drawTerminal() {
        const ctx = this.ctx;
        const history = this.shell.getHistory();
        // Show last MAX_LINES lines
        const visible = history.slice(-MAX_LINES);
        let y = PADDING;
        for (const line of visible) {
            if (line.startsWith(this.shell.getPromptPrefix())) {
                // Prompt line — split into prompt + command
                const promptEnd = line.indexOf('$') + 2;
                ctx.fillStyle = COLOR_PROMPT;
                ctx.fillText(line.slice(0, promptEnd), PADDING, y);
                ctx.fillStyle = COLOR_TEXT;
                ctx.fillText(line.slice(promptEnd), PADDING + ctx.measureText(line.slice(0, promptEnd)).width, y);
            }
            else if (line.startsWith('  ') || line === '') {
                ctx.fillStyle = COLOR_DIM;
                ctx.fillText(line, PADDING, y);
            }
            else {
                ctx.fillStyle = COLOR_TEXT;
                ctx.fillText(line, PADDING, y);
            }
            y += LINE_HEIGHT;
        }
        // Current prompt + input
        const prompt = this.shell.getPrompt();
        ctx.fillStyle = COLOR_PROMPT;
        ctx.fillText(prompt, PADDING, y);
        const promptWidth = ctx.measureText(prompt).width;
        const input = this.shell.getCurrentInput();
        ctx.fillStyle = COLOR_TEXT;
        ctx.fillText(input, PADDING + promptWidth, y);
        // Cursor
        if (this.cursorVisible) {
            const cursorX = PADDING + promptWidth + ctx.measureText(input).width;
            ctx.fillStyle = COLOR_CURSOR;
            ctx.fillRect(cursorX, y, 8, FONT_SIZE);
        }
    }
    dispose() {
        this.canvasTexture.dispose();
    }
}
