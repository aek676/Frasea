use serde::Serialize;

#[derive(Serialize)]
pub struct Example {
    pub source: String,
    pub target: String,
}

#[derive(Serialize)]
pub struct Translation {
    pub word: String,
    pub examples: Vec<Example>,
}
