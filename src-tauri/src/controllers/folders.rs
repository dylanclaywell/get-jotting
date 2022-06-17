use crate::models::folder;
use uuid::Uuid;

#[tauri::command]
pub fn create_folder(name: String) {
  let id = Uuid::new_v4();
  let folder = folder::Folder {
    id: id.to_string(),
    name,
  };

  folder::create(folder);
}

#[tauri::command]
pub fn get_folders() -> String {
  return serde_json::to_string(&folder::get_all()).unwrap();
}

#[tauri::command]
pub fn delete_folder(id: String) {
  folder::delete(id)
}
