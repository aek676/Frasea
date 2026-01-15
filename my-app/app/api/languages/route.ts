import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

interface Language {
  name: string;
  code: string;
}

export async function GET() {
  try {
    const url = 'https://cloud.google.com/translate/docs/languages';

    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    const languages: Language[] = [];

    const table = $('table').first().find('tbody tr');

    table.each((index, element) => {
      const columns = $(element).find('td');

      if (columns.length >= 2) {
        const language: Language = {
          name: $(columns[0]).text().trim(),
          code: $(columns[1]).find('code').text().trim(),
        };

        if (language.code) {
          languages.push(language);
        }
      }
    });

    return NextResponse.json({ languages });
  } catch (error) {
    console.error('Error al scrapear los idiomas:', error);
    return NextResponse.json(
      { error: 'Error al obtener los idiomas' },
      { status: 500 }
    );
  }
}
