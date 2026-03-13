import { personal } from '@/data/personal';
function ok(output) {
    return { output };
}
function err(msg) {
    return { output: msg, error: true };
}
export const commands = {
    help: () => ok([
        'Available commands:',
        '',
        '  ls              List directory contents',
        '  cd [dir]        Change directory',
        '  cat [file]      Display file contents',
        '  pwd             Print working directory',
        '  whoami          Display user info',
        '  skills          Show technical skills',
        '  contact         Show contact information',
        '  open [target]   Open github or linkedin in browser',
        '  resume          Download resume PDF',
        '  clear           Clear terminal',
        '  help            Show this message',
    ].join('\n')),
    ls: (args, fs) => {
        const path = args[0];
        const items = fs.listDir(path);
        if (items.length === 0)
            return ok('(empty)');
        const output = items.map(item => item.type === 'dir' ? item.name + '/' : item.name).join('  ');
        return ok(output);
    },
    cd: (args, fs) => {
        const target = args[0] ?? '~';
        const success = fs.changeDir(target);
        if (!success)
            return err(`cd: ${target}: No such file or directory`);
        return ok('');
    },
    cat: (args, fs) => {
        if (!args[0])
            return err('cat: missing file operand');
        const file = fs.getFile(args[0]);
        if (!file)
            return err(`cat: ${args[0]}: No such file`);
        return ok(file.content);
    },
    pwd: (_args, fs) => ok(fs.getCurrentPath()),
    whoami: () => ok([
        personal.name,
        personal.tagline,
        '',
        `Email: ${personal.email}`,
        `GitHub: ${personal.githubUrl}`,
    ].join('\n')),
    skills: () => {
        // Dynamic import to avoid circular deps — read from data directly
        const lines = [
            'Languages:  Python, Java, JavaScript, TypeScript, C, SQL, R, Rust',
            'Frameworks: React, Node.js, Spring Boot, Flask, FastAPI, scikit-learn',
            'Databases:  PostgreSQL, MariaDB, Supabase, Docker, GCP, Tableau',
            'Concepts:   REST APIs, CI/CD, Agile, Scrum, A/B Testing, Serverless',
        ];
        return ok(lines.join('\n'));
    },
    contact: () => ok([
        `Name:     ${personal.name}`,
        `Email:    ${personal.email}`,
        `Phone:    ${personal.phone}`,
        `GitHub:   ${personal.githubUrl}`,
        `LinkedIn: ${personal.linkedinUrl}`,
        `Web:      https://${personal.domain}`,
    ].join('\n')),
    open: (args) => {
        const target = args[0]?.toLowerCase();
        const map = {
            github: personal.githubUrl,
            linkedin: personal.linkedinUrl,
        };
        if (!target || !map[target]) {
            return err(`open: available targets: github, linkedin`);
        }
        const a = document.createElement('a');
        a.href = map[target];
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return ok(`Opening ${map[target]}...`);
    },
    resume: () => {
        const a = document.createElement('a');
        a.href = personal.resumePath;
        a.download = 'UddinRajinResume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return ok('Downloading resume...');
    },
    clear: () => ({ output: '', clear: true }),
};
