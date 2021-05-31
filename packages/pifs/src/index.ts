import { promisify } from 'util'
import fs from 'graceful-fs'

export const access = promisify(fs.access)
export const appendFile = promisify(fs.appendFile)
export const chmod = promisify(fs.chmod)
export const chown = promisify(fs.chown)
export const close = promisify(fs.close)
export const constants = fs.constants
export const copyFile = promisify(fs.copyFile)
export const createReadStream = fs.createReadStream
export const createWriteStream = fs.createWriteStream
export const fchmod = promisify(fs.fchmod)
export const fchown = promisify(fs.fchown)
export const fdatasync = promisify(fs.fdatasync)
export const fstat = promisify(fs.fstat)
export const fsync = promisify(fs.fsync)
export const ftruncate = promisify(fs.ftruncate)
export const futimes = promisify(fs.futimes)
export const lchmod = promisify(fs.lchmod)
export const lchown = promisify(fs.lchown)
export const link = promisify(fs.link)
export const lstat = promisify(fs.lstat)
export const mkdir = promisify(fs.mkdir)
export const mkdtemp = promisify(fs.mkdtemp)
export const open = promisify(fs.open)
export const opendir = promisify(fs.opendir)
export const read = promisify(fs.read)
export const readv = promisify(fs.readv)
export const readdir = promisify(fs.readdir)
export const readFile = promisify(fs.readFile)
export const readlink = promisify(fs.readlink)
export const realpath = promisify(fs.realpath)
export const rename = promisify(fs.rename)
export const rmdir = promisify(fs.rmdir)
export const stat = promisify(fs.stat)
export const symlink = promisify(fs.symlink)
export const truncate = promisify(fs.truncate)
export const unlink = promisify(fs.unlink)
export const unwatchFile = fs.unwatchFile
export const utimes = promisify(fs.utimes)
export const watch = fs.watch
export const watchFile = fs.watchFile
export const write = promisify(fs.write)
export const writev = promisify(fs.writev)
export const writeFile = promisify(fs.writeFile)
export const Dir = fs.Dir
export const Dirent = fs.Dirent
export const Stats = fs.Stats
export const ReadStream = fs.ReadStream
export const WriteStream = fs.WriteStream

export default {
  access,
  appendFile,
  chmod,
  chown,
  close,
  constants,
  copyFile,
  createReadStream,
  createWriteStream,
  fchmod,
  fchown,
  fdatasync,
  fstat,
  fsync,
  ftruncate,
  futimes,
  lchmod,
  lchown,
  link,
  lstat,
  mkdir,
  mkdtemp,
  open,
  opendir,
  read,
  readv,
  readdir,
  readFile,
  readlink,
  realpath,
  rename,
  rmdir,
  stat,
  symlink,
  truncate,
  unlink,
  unwatchFile,
  utimes,
  watch,
  watchFile,
  write,
  writev,
  writeFile,
  Dir,
  Dirent,
  Stats,
  ReadStream,
  WriteStream,
}
