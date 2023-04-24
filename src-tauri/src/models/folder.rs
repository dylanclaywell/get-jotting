use crate::database;
use serde::{Deserialize, Serialize};
use sqlite::{Error, State};
use tauri::AppHandle;

#[derive(Serialize, Deserialize, Debug)]
pub struct Folder {
    pub id: String,
    pub name: String,
}

pub fn create(app_handle: &AppHandle, folder: Folder) -> Result<Folder, Error> {
    let connection = database::initialize_database(app_handle)?;

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

    Ok(folder)
}

pub fn delete(app_handle: &AppHandle, id: String) -> Result<(), Error> {
    let connection = database::initialize_database(app_handle)?;

    let mut delete_folder_notes_statement = connection
        .prepare(
            "
      delete from notes where folderId = ?
    ",
        )
        .unwrap();

    delete_folder_notes_statement.bind(1, &*id).unwrap();

    delete_folder_notes_statement.next().unwrap();

    let mut delete_folder_statement = connection
        .prepare(
            "
        delete from folders where id = ?
      ",
        )
        .unwrap();

    delete_folder_statement.bind(1, &*id).unwrap();

    delete_folder_statement.next().unwrap();

    println!("Deleting folder");
    println!("  - id: {}", id);

    Ok(())
}

pub fn get_all(app_handle: &AppHandle) -> Result<Vec<Folder>, Error> {
    let connection = database::initialize_database(app_handle)?;

    let mut folders = Vec::new();

    let mut statement = connection
        .prepare(
            "
        select id, name from folders
      ",
        )
        .unwrap();

    while let State::Row = statement.next().unwrap() {
        let folder = Folder {
            id: statement.read::<String>(0).unwrap(),
            name: statement.read::<String>(1).unwrap(),
        };

        folders.push(folder)
    }

    Ok(folders)
}
