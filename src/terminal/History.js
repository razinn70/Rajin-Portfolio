const MAX_HISTORY = 100;
export class History {
    entries = [];
    index = -1;
    push(cmd) {
        if (cmd.trim() === '')
            return;
        // Avoid duplicate consecutive entries
        if (this.entries[this.entries.length - 1] !== cmd) {
            this.entries.push(cmd);
            if (this.entries.length > MAX_HISTORY) {
                this.entries.shift();
            }
        }
        this.reset();
    }
    prev() {
        if (this.entries.length === 0)
            return null;
        if (this.index === -1) {
            this.index = this.entries.length - 1;
        }
        else if (this.index > 0) {
            this.index--;
        }
        return this.entries[this.index] ?? null;
    }
    next() {
        if (this.index === -1)
            return null;
        if (this.index < this.entries.length - 1) {
            this.index++;
            return this.entries[this.index];
        }
        this.reset();
        return '';
    }
    reset() {
        this.index = -1;
    }
}
