use crate::database;
use serde::{Deserialize, Serialize};
use sqlite::State;

#[derive(Serialize, Deserialize, Debug)]
pub struct Note {
  pub id: String,
  pub folder_id: String,
  pub name: String,
  pub text: String,
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

pub fn create(note: Note) {
  if !database::table_exists(String::from("notes")) {
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

pub fn get_all_by_folder_id(folder_id: String) -> Vec<Note> {
  let connection = sqlite::open("./database.db").unwrap();

  if !database::table_exists(String::from("notes")) {
    create_notes_table();
  }

  let mut notes = Vec::new();

  let mut statement = connection
    .prepare(
      "
        select id, folderId, name, text from notes where folderId = ?
      ",
    )
    .unwrap();

  statement.bind(1, &*folder_id).unwrap();

  while let State::Row = statement.next().unwrap() {
    let note = Note {
      id: statement.read::<String>(0).unwrap(),
      folder_id: statement.read::<String>(1).unwrap(),
      name: statement.read::<String>(2).unwrap(),
      text: statement.read::<String>(3).unwrap(),
    };

    notes.push(note)
  }

  return notes;
}

pub fn update_name(id: String, name: String) {
  if !database::table_exists(String::from("notes")) {
    create_notes_table();
  }

  let connection = sqlite::open("./database.db").unwrap();
  let mut statement = connection
    .prepare(
      "
        update notes set name = ? where id = ?
      ",
    )
    .unwrap();

  statement.bind(1, &*name).unwrap();
  statement.bind(2, &*id).unwrap();

  statement.next().unwrap();

  println!("Updating note name");
  println!("  - id: {}", id);
  println!("  - newName: {}", name);
}

pub fn update_text(id: String, text: String) {
  if !database::table_exists(String::from("notes")) {
    create_notes_table();
  }

  let connection = sqlite::open("./database.db").unwrap();
  let mut statement = connection
    .prepare(
      "
        update notes set text = ? where id = ?
      ",
    )
    .unwrap();

  statement.bind(1, &*text).unwrap();
  statement.bind(2, &*id).unwrap();

  statement.next().unwrap();

  println!("Updating note text");
  println!("  - id: {}", id);
  println!("  - newText: {}", text);
}
