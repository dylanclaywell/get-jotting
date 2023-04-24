use sqlite::{Connection, Error};

fn create_folders_table(connection: &Connection) -> bool {
    let statement = String::from(
        "
      CREATE TABLE if not exists folders (
        id TEXT,
        name TEXT,
        PRIMARY KEY(id)
      )
    ",
    );

    connection.execute(statement).unwrap();

    return true;
}

fn create_notes_table(connection: &Connection) -> bool {
    let statement = String::from(
        "
  CREATE TABLE if not exists notes (
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

    return true;
}

pub fn create_tables(connection: &Connection) -> bool {
    return create_folders_table(&connection) && create_notes_table(&connection);
}

pub fn initialize_database(app_handle: &tauri::AppHandle) -> Result<Connection, Error> {
    let path = app_handle.path_resolver().app_data_dir().unwrap();
    let path_string = path.display();

    if !path.exists() {
        std::fs::create_dir_all(&path).unwrap();
    }

    let connection = sqlite::open(format!("{}{}", path_string, String::from("/database.db")))?;

    create_tables(&connection);

    return Ok(connection);
}
