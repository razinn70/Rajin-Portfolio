const BOOT_SEQUENCE = [
    'BIOS 2.0 — rajinuddin.dev',
    'Checking memory................',
    'Initializing THREE.js renderer.',
    'Mounting virtual filesystem....',
    'Compiling shaders..............',
    'Starting terminal..............',
    '',
    'Welcome.',
];
export class LoadingScreen {
    el;
    linesEl;
    constructor() {
        this.el = document.createElement('div');
        this.el.id = 'loading-screen';
        Object.assign(this.el.style, {
            position: 'fixed',
            inset: '0',
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '200',
            transition: 'opacity 0.7s ease',
        });
        // Grid lines background
        const grid = document.createElement('div');
        Object.assign(grid.style, {
            position: 'absolute',
            inset: '0',
            backgroundImage: [
                'linear-gradient(rgba(255,203,164,0.06) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(255,203,164,0.06) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '50px 50px',
            pointerEvents: 'none',
        });
        this.el.appendChild(grid);
        // Terminal box
        const box = document.createElement('div');
        Object.assign(box.style, {
            position: 'relative',
            width: 'min(480px, 90vw)',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '13px',
            lineHeight: '1.8',
            color: '#c8ffc8',
            padding: '24px',
            border: '1px solid rgba(255,203,164,0.2)',
            background: 'rgba(5,15,10,0.8)',
        });
        const name = document.createElement('div');
        name.textContent = '> rajin@rajinuddin.dev';
        Object.assign(name.style, { color: '#ffcba4', marginBottom: '16px', fontWeight: '700' });
        box.appendChild(name);
        this.linesEl = document.createElement('div');
        box.appendChild(this.linesEl);
        this.el.appendChild(box);
        document.body.appendChild(this.el);
    }
    show() {
        this.el.style.opacity = '1';
        let i = 0;
        const addLine = () => {
            if (i >= BOOT_SEQUENCE.length)
                return;
            const line = document.createElement('div');
            const text = BOOT_SEQUENCE[i];
            if (text === '') {
                line.innerHTML = '&nbsp;';
            }
            else if (i === BOOT_SEQUENCE.length - 1) {
                line.textContent = text;
                line.style.color = '#ffcba4';
            }
            else {
                const parts = text.split('.');
                line.innerHTML =
                    `<span>${parts[0]}</span>` +
                        `<span style="color:#3a5a3a">${'.'.repeat(text.length - parts[0].length - 2)}</span>` +
                        `<span style="color:#4aff8a"> OK</span>`;
            }
            this.linesEl.appendChild(line);
            i++;
            setTimeout(addLine, i === 1 ? 300 : 140);
        };
        addLine();
    }
    hide() {
        return new Promise(resolve => {
            this.el.style.opacity = '0';
            setTimeout(() => {
                this.el.remove();
                resolve();
            }, 700);
        });
    }
}
