use crate::database;
use serde::{Deserialize, Serialize};
use sqlite::{Error, State};
use tauri::AppHandle;

#[derive(Serialize, Deserialize, Debug)]
pub struct Note {
    pub id: String,
    pub folder_id: String,
    pub name: String,
    pub text: String,
}

pub fn create(app_handle: &AppHandle, note: Note) -> Result<(), Error> {
    let connection = database::initialize_database(app_handle)?;
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

    Ok(())
}

pub fn get_all_by_folder_id(app_handle: &AppHandle, folder_id: String) -> Result<Vec<Note>, Error> {
    let connection = database::initialize_database(app_handle)?;

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

    return Ok(notes);
}

pub fn update_name(app_handle: &AppHandle, id: String, name: String) -> Result<(), Error> {
    let connection = database::initialize_database(app_handle)?;
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

    Ok(())
}

pub fn update_text(app_handle: &AppHandle, id: String, text: String) -> Result<(), Error> {
    let connection = database::initialize_database(app_handle)?;
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

    Ok(())
}

pub fn delete(app_handle: &AppHandle, id: String) -> Result<(), Error> {
    let connection = database::initialize_database(app_handle)?;
    let mut statement = connection
        .prepare(
            "
        delete from notes where id = ?
      ",
        )
        .unwrap();

    statement.bind(1, &*id).unwrap();

    statement.next().unwrap();

    println!("Deleting note");
    println!("  - id: {}", id);

    Ok(())
}
