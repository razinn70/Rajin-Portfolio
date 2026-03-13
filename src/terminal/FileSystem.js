function findChild(dir, name) {
    return dir.children.find(c => c.name === name);
}
export class FileSystem {
    root;
    currentPath;
    constructor(root) {
        this.root = root;
        // Start at ~/home/rajin
        this.currentPath = ['home', 'rajin'];
    }
    getCurrentPath() {
        if (this.currentPath.length === 0)
            return '/';
        const path = this.currentPath.join('/');
        // Render home dir as ~
        if (path === 'home/rajin')
            return '~';
        if (path.startsWith('home/rajin/'))
            return '~/' + path.slice('home/rajin/'.length);
        return '/' + path;
    }
    getPromptPath() {
        return this.getCurrentPath();
    }
    listDir(targetPath) {
        const dir = targetPath ? this.resolveDir(targetPath) : this.currentDir();
        if (!dir)
            return [];
        return dir.children;
    }
    getFile(filePath) {
        const parts = this.resolvePath(filePath);
        if (!parts)
            return null;
        let node = this.root;
        for (const part of parts) {
            if (node.type !== 'dir')
                return null;
            const child = findChild(node, part);
            if (!child)
                return null;
            node = child;
        }
        return node.type === 'file' ? node : null;
    }
    changeDir(path) {
        if (path === '~') {
            this.currentPath = ['home', 'rajin'];
            return true;
        }
        const resolved = this.resolvePath(path);
        if (!resolved)
            return false;
        let node = this.root;
        for (const part of resolved) {
            if (node.type !== 'dir')
                return false;
            const child = findChild(node, part);
            if (!child)
                return false;
            node = child;
        }
        if (node.type !== 'dir')
            return false;
        this.currentPath = resolved;
        return true;
    }
    complete(partial) {
        const dir = this.currentDir();
        if (!dir)
            return [];
        return dir.children
            .filter(c => c.name.startsWith(partial))
            .map(c => c.name + (c.type === 'dir' ? '/' : ''));
    }
    currentDir() {
        return this.resolveDir(this.currentPath.join('/'));
    }
    resolveDir(path) {
        const parts = this.resolvePath(path);
        if (!parts)
            return null;
        if (parts.length === 0)
            return this.root;
        let node = this.root;
        for (const part of parts) {
            if (node.type !== 'dir')
                return null;
            const child = findChild(node, part);
            if (!child)
                return null;
            node = child;
        }
        return node.type === 'dir' ? node : null;
    }
    resolvePath(path) {
        // Normalise separators
        const p = path.replace(/\\/g, '/');
        let base;
        if (p === '~' || p === '')
            return ['home', 'rajin'];
        if (p.startsWith('~/')) {
            base = ['home', 'rajin', ...p.slice(2).split('/').filter(Boolean)];
        }
        else if (p.startsWith('/')) {
            base = p.slice(1).split('/').filter(Boolean);
        }
        else {
            base = [...this.currentPath];
            for (const segment of p.split('/').filter(Boolean)) {
                if (segment === '.')
                    continue;
                if (segment === '..') {
                    if (base.length > 0)
                        base.pop();
                }
                else {
                    base.push(segment);
                }
            }
            return base;
        }
        // Process . and ..
        const resolved = [];
        for (const segment of base) {
            if (segment === '.')
                continue;
            if (segment === '..') {
                if (resolved.length > 0)
                    resolved.pop();
            }
            else {
                resolved.push(segment);
            }
        }
        return resolved;
    }
}
