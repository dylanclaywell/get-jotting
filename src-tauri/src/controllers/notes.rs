use crate::models::note;
use uuid::Uuid;

#[tauri::command]
pub fn create_note(name: String, folder_id: String, text: String) {
  let id = Uuid::new_v4();
  let note = note::Note {
    id: id.to_string(),
    name,
    folder_id,
    text,
  };

  note::create(note);
}

#[tauri::command]
pub fn get_notes(folder_id: String) -> String {
  return serde_json::to_string(&note::get_all_by_folder_id(folder_id)).unwrap();
}

#[tauri::command]
pub fn update_note_name(id: String, name: String) {
  note::update_name(id, name)
}

#[tauri::command]
pub fn update_note_text(id: String, text: String) {
  note::update_text(id, text)
}
