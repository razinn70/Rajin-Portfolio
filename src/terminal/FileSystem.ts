import type { FSFile, FSDir } from '@/data/filesystem'

type FSNode = FSFile | FSDir

function findChild(dir: FSDir, name: string): FSNode | undefined {
  return (dir.children as FSNode[]).find(c => c.name === name)
}

export class FileSystem {
  private root: FSDir
  private currentPath: string[]

  constructor(root: FSDir) {
    this.root = root
    // Start at ~/home/rajin
    this.currentPath = ['home', 'rajin']
  }

  getCurrentPath(): string {
    if (this.currentPath.length === 0) return '/'
    const path = this.currentPath.join('/')
    // Render home dir as ~
    if (path === 'home/rajin') return '~'
    if (path.startsWith('home/rajin/')) return '~/' + path.slice('home/rajin/'.length)
    return '/' + path
  }

  getPromptPath(): string {
    return this.getCurrentPath()
  }

  listDir(targetPath?: string): FSNode[] {
    const dir = targetPath ? this.resolveDir(targetPath) : this.currentDir()
    if (!dir) return []
    return dir.children
  }

  getFile(filePath: string): FSFile | null {
    const parts = this.resolvePath(filePath)
    if (!parts) return null

    let node: FSNode = this.root
    for (const part of parts) {
      if (node.type !== 'dir') return null
      const child = findChild(node, part)
      if (!child) return null
      node = child
    }

    return node.type === 'file' ? node : null
  }

  changeDir(path: string): boolean {
    if (path === '~') {
      this.currentPath = ['home', 'rajin']
      return true
    }

    const resolved = this.resolvePath(path)
    if (!resolved) return false

    let node: FSNode = this.root
    for (const part of resolved) {
      if (node.type !== 'dir') return false
      const child = findChild(node, part)
      if (!child) return false
      node = child
    }

    if (node.type !== 'dir') return false
    this.currentPath = resolved
    return true
  }

  complete(partial: string): string[] {
    const dir = this.currentDir()
    if (!dir) return []
    return (dir.children as FSNode[])
      .filter(c => c.name.startsWith(partial))
      .map(c => c.name + (c.type === 'dir' ? '/' : ''))
  }

  private currentDir(): FSDir | null {
    return this.resolveDir(this.currentPath.join('/'))
  }

  private resolveDir(path: string): FSDir | null {
    const parts = this.resolvePath(path)
    if (!parts) return null
    if (parts.length === 0) return this.root

    let node: FSNode = this.root
    for (const part of parts) {
      if (node.type !== 'dir') return null
      const child = findChild(node, part)
      if (!child) return null
      node = child
    }

    return node.type === 'dir' ? node : null
  }

  private resolvePath(path: string): string[] | null {
    // Normalise separators
    const p = path.replace(/\\/g, '/')

    let base: string[]
    if (p === '~' || p === '') return ['home', 'rajin']
    if (p.startsWith('~/')) {
      base = ['home', 'rajin', ...p.slice(2).split('/').filter(Boolean)]
    } else if (p.startsWith('/')) {
      base = p.slice(1).split('/').filter(Boolean)
    } else {
      base = [...this.currentPath]
      for (const segment of p.split('/').filter(Boolean)) {
        if (segment === '.') continue
        if (segment === '..') {
          if (base.length > 0) base.pop()
        } else {
          base.push(segment)
        }
      }
      return base
    }

    // Process . and ..
    const resolved: string[] = []
    for (const segment of base) {
      if (segment === '.') continue
      if (segment === '..') {
        if (resolved.length > 0) resolved.pop()
      } else {
        resolved.push(segment)
      }
    }
    return resolved
  }
}
