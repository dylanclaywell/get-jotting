#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod controllers;
pub mod database;
pub mod models;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      controllers::folders::create_folder,
      controllers::folders::delete_folder,
      controllers::folders::get_folders,
      controllers::notes::create_note,
      controllers::notes::delete_note,
      controllers::notes::get_notes,
      controllers::notes::update_note_name,
      controllers::notes::update_note_text,
    ])
    // .invoke_handler(tauri::generate_handler![create_note])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
