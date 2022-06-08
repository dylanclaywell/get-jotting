#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use sqlite::State;
use uuid::Uuid;

struct Folder {
  id: String,
  name: String,
}

struct Note {
  id: String,
  folder_id: String,
  name: String,
  text: String,
}

fn table_exists(table_name: String) -> bool {
  let connection = sqlite::open("./database.db").unwrap();

  let mut statement = connection
    .prepare(
      "
      select count(*) as count from sqlite_master
      where type = 'table' and name = ?
    ",
    )
    .unwrap();

  statement.bind(1, &*table_name).unwrap();

  let mut count = String::from("0");

  while let State::Row = statement.next().unwrap() {
    count = statement.read::<String>(0).unwrap_or(String::from("0"));
  }

  return count != "0";
}

fn create_notes_table() {
  let connection = sqlite::open("./database.db").unwrap();

  let statement = String::from(
    "
      CREATE TABLE notes (
       id TEXT NOT NULL,
       folderId TEXT NOT NULL,
       text BLOB,
       name TEXT NOT NULL,
       PRIMARY KEY(id),
       FOREIGN KEY(folderId) REFERENCES folders(id)
      )
    ",
  );

  connection.execute(statement).unwrap();
}

fn create_folders_table() {
  let connection = sqlite::open("./database.db").unwrap();

  let statement = String::from(
    "
      CREATE TABLE folders (
        id TEXT,
        name TEXT,
        PRIMARY KEY(id)
      )
    ",
  );

  connection.execute(statement).unwrap();
}

fn create_folder_model(folder: Folder) -> Folder {
  if !table_exists(String::from("folders")) {
    create_folders_table();
  }

  let connection = sqlite::open("./database.db").unwrap();
  let mut statement = connection
    .prepare(
      "
        insert into folders (
          id,
          name
        ) values (
          ?,
          ?
        )
      ",
    )
    .unwrap();

  statement.bind(1, &*folder.id).unwrap();
  statement.bind(2, &*folder.name).unwrap();

  statement.next().unwrap();

  println!("Creating folder");
  println!("  - id: {}", folder.id);
  println!("  - name: {}", folder.name);

  return folder;
}

fn create_note_model(note: Note) {
  if !table_exists(String::from("notes")) {
    create_notes_table();
  }

  let connection = sqlite::open("./database.db").unwrap();
  let mut statement = connection
    .prepare(
      "
        insert into notes (
          id,
          folderId,
          name,
          text
        ) values (
          ?,
          ?,
          ?,
          ?
        )
      ",
    )
    .unwrap();

  statement.bind(1, &*note.id).unwrap();
  statement.bind(2, &*note.folder_id).unwrap();
  statement.bind(3, &*note.name).unwrap();
  statement.bind(4, &*note.text).unwrap();

  statement.next().unwrap();

  println!("Creating note");
  println!("  - id: {}", note.id);
  println!("  - name: {}", note.name);
  println!("  - folder: {}", note.folder_id);
  println!("  - text: {}", note.text);
}

#[tauri::command]
fn create_folder(name: String) {
  let id = Uuid::new_v4();
  let folder = Folder {
    id: id.to_string(),
    name,
  };

  create_folder_model(folder);
}

#[tauri::command]
fn create_note(name: String, folder_id: String, text: String) {
  let id = Uuid::new_v4();
  let note = Note {
    id: id.to_string(),
    name,
    folder_id,
    text,
  };

  create_note_model(note);
}

#[tauri::command]
fn get_folders() -> Vec<Folder> {
  return Vec::new();
}

#[tauri::command]
fn get_notes() -> Vec<Note> {
  return Vec::new();
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![create_folder, create_note])
    // .invoke_handler(tauri::generate_handler![create_note])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
