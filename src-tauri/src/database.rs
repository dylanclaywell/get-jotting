use sqlite::State;

pub fn table_exists(table_name: String) -> bool {
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
