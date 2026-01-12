use axum::{Json, extract::Path, http::StatusCode, response::IntoResponse};

use crate::services::scraper::{ScraperError, perform_scraping};

pub async fn translate_handler(
    Path((source, target, word)): Path<(String, String, String)>,
) -> impl IntoResponse {
    match perform_scraping(&source, &target, &word).await {
        Ok(translations) => (StatusCode::OK, Json(translations)).into_response(),
        Err(error) => match error {
            ScraperError::NotFound => {
                (StatusCode::NOT_FOUND, "Translation not found").into_response()
            }
            ScraperError::Network(msg) => {
                (StatusCode::BAD_GATEWAY, format!("Network error: {}", msg)).into_response()
            }
            _ => (StatusCode::INTERNAL_SERVER_ERROR, "Unknown error").into_response(),
        },
    }
}
