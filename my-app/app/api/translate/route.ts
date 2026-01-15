import { translate } from "@vitalets/google-translate-api";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { text, from, to } = body;

        if (!text || !from || !to) {
            return NextResponse.json(
                { error: 'Missing required fields: text, from, or to' },
                { status: 400 }
            );
        }

        const { text: translatedText } = await translate(text, {
            from: from,
            to: to,
        });

        return NextResponse.json({
            originalText: text,
            from,
            to,
            translatedText
        });

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json(
            { error: 'Failed to process translation request', message: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}