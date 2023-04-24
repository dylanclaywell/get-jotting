use crate::models::folder;
use tauri::AppHandle;
use uuid::Uuid;

#[tauri::command]
pub fn create_folder(app_handle: AppHandle, name: String) {
    let id = Uuid::new_v4();
    let folder = folder::Folder {
        id: id.to_string(),
        name,
    };

    folder::create(&app_handle, folder);
}

#[tauri::command]
pub fn get_folders(app_handle: AppHandle) -> String {
    let folders = folder::get_all(&app_handle).unwrap();
    return serde_json::to_string(&folders).unwrap();
}

#[tauri::command]
pub fn delete_folder(app_handle: AppHandle, id: String) {
    if folder::delete(&app_handle, id).is_err() {
        println!("Error deleting folder");
    }
}
