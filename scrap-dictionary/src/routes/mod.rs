pub mod root;
pub mod user_routes;

use axum::{
    Router,
    routing::{get, post},
};

pub fn create_router() -> Router {
    Router::new()
        .route("/", get(root::root))
        .route("/users", post(user_routes::create_user))
}
