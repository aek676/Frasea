pub mod health;
pub mod root;

use axum::{Router, routing::get};

pub fn create_router() -> Router {
    Router::new()
        .route("/{source}/{target}/{word}", get(root::translate_handler))
        .route("/health", get(health::health))
}
