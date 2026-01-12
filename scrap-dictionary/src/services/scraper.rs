use std::sync::OnceLock;

use reqwest::{Client, StatusCode};
use scraper::{Html, Selector};

use crate::models::translation::{Example, Translation};

static CLIENT: OnceLock<Client> = OnceLock::new();
fn client() -> &'static Client {
    CLIENT.get_or_init(|| {
        Client::builder()
            .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
            .build()
            .expect("failed to build reqwest Client")
    })
}

static ITEM_SELECTOR: OnceLock<Selector> = OnceLock::new();
fn item_selector() -> &'static Selector {
    ITEM_SELECTOR.get_or_init(|| Selector::parse("li[data-element='translation']").unwrap())
}

static PHRASE_SELECTOR: OnceLock<Selector> = OnceLock::new();
fn phrase_selector() -> &'static Selector {
    PHRASE_SELECTOR.get_or_init(|| Selector::parse(".translation__item__phrase").unwrap())
}

static PHARSE_SELECTOR: OnceLock<Selector> = OnceLock::new();
fn pharse_selector() -> &'static Selector {
    PHARSE_SELECTOR.get_or_init(|| Selector::parse(".translation__item__pharse").unwrap())
}

static EXAMPLE_CONTAINER_SELECTOR: OnceLock<Selector> = OnceLock::new();
fn example_container_selector() -> &'static Selector {
    EXAMPLE_CONTAINER_SELECTOR.get_or_init(|| Selector::parse(".translation__example").unwrap())
}

static P_SELECTOR: OnceLock<Selector> = OnceLock::new();
fn p_selector() -> &'static Selector {
    P_SELECTOR.get_or_init(|| Selector::parse("p").unwrap())
}

pub enum ScraperError {
    Network(String),
    NotFound,
}

pub async fn perform_scraping(
    source: &str,
    target: &str,
    word: &str,
) -> Result<Vec<Translation>, ScraperError> {
    let url = format!("https://es.glosbe.com/{}/{}/{}", source, target, word);

    let response = client()
        .get(&url)
        .send()
        .await
        .map_err(|e| ScraperError::Network(e.to_string()))?;

    if response.status() == StatusCode::NOT_FOUND {
        return Err(ScraperError::NotFound);
    }

    if !response.status().is_success() {
        return Err(ScraperError::Network(format!(
            "Bad status from upstream: {}",
            response.status()
        )));
    }

    let body = response
        .text()
        .await
        .map_err(|e| ScraperError::Network(e.to_string()))?;

    let document = Html::parse_document(&body);

    let mut results = Vec::new();

    for element in document.select(item_selector()) {
        let translation_elem = element
            .select(phrase_selector())
            .next()
            .or_else(|| element.select(pharse_selector()).next());

        let translation_elem = match translation_elem {
            Some(e) => e,
            None => continue,
        };

        let translation_text = translation_elem
            .text()
            .collect::<String>()
            .trim()
            .to_owned();

        let mut examples = Vec::new();

        for example_div in element.select(example_container_selector()) {
            let mut paragraphs = example_div.select(p_selector());
            if let (Some(source_p), Some(target_p)) = (paragraphs.next(), paragraphs.next()) {
                examples.push(Example {
                    source: source_p.text().collect::<String>().trim().to_owned(),
                    target: target_p.text().collect::<String>().trim().to_owned(),
                });
            }
        }

        results.push(Translation {
            word: translation_text,
            examples,
        });
    }

    Ok(results)
}
