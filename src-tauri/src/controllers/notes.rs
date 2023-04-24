use crate::models::note;
use tauri::AppHandle;
use uuid::Uuid;

#[tauri::command]
pub fn create_note(app_handle: AppHandle, name: String, folder_id: String, text: String) {
    let id = Uuid::new_v4();
    let note = note::Note {
        id: id.to_string(),
        name,
        folder_id,
        text,
    };

    if note::create(&app_handle, note).is_err() {
        println!("Error creating note");
    }
}

#[tauri::command]
pub fn get_notes(app_handle: AppHandle, folder_id: String) -> String {
    let notes = note::get_all_by_folder_id(&app_handle, folder_id).unwrap();
    return serde_json::to_string(&notes).unwrap();
}

#[tauri::command]
pub fn update_note_name(app_handle: AppHandle, id: String, name: String) {
    if note::update_name(&app_handle, id, name).is_err() {
        println!("Error updating note name");
    }
}

#[tauri::command]
pub fn update_note_text(app_handle: AppHandle, id: String, text: String) {
    if note::update_text(&app_handle, id, text).is_err() {
        println!("Error updating note text");
    }
}

#[tauri::command]
pub fn delete_note(app_handle: AppHandle, id: String) {
    if note::delete(&app_handle, id).is_err() {
        println!("Error deleting note");
    }
}
