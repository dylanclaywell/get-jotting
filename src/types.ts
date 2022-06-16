export interface Folder {
  id: string
  name: string
}

export interface Note {
  id: string
  name: string
  folderId: string
  text: string
}
