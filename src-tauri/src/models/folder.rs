use crate::database;
use serde::{Deserialize, Serialize};
use sqlite::State;

#[derive(Serialize, Deserialize, Debug)]
pub struct Folder {
  pub id: String,
  pub name: String,
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

pub fn create(folder: Folder) -> Folder {
  if !database::table_exists(String::from("folders")) {
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

pub fn get_all() -> Vec<Folder> {
  let connection = sqlite::open("./database.db").unwrap();

  if !database::table_exists(String::from("folders")) {
    create_folders_table();
  }

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

  return folders;
}
