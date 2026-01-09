import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Obtener el username de los parámetros de búsqueda
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        // Buscar el usuario
        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Devolver el historial de traducciones ordenado por fecha (más reciente primero)
        const sortedHistory = user.translationHistory.sort((a: { timestamp: Date }, b: { timestamp: Date }) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return NextResponse.json({
            success: true,
            history: sortedHistory
        });

    } catch (error) {
        console.error('Error getting translation history:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('POST /api/historial - Iniciando...');
        await connectMongo();

        const body = await request.json();
        console.log('Datos recibidos:', body);
        const { username, originalText, translatedText, sourceLanguage, targetLanguage } = body;

        // Validar datos requeridos
        if (!username || !originalText || !translatedText || !sourceLanguage || !targetLanguage) {
            console.log('Faltan campos requeridos:', {
                username: !!username,
                originalText: !!originalText,
                translatedText: !!translatedText,
                sourceLanguage: !!sourceLanguage,
                targetLanguage: !!targetLanguage
            });
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Buscar el usuario
        console.log('Buscando usuario:', username);
        const user = await User.findOne({ username });

        if (!user) {
            console.log('Usuario no encontrado:', username);
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        console.log('Usuario encontrado, agregando traducción al historial...');

        // Agregar la nueva traducción al historial
        const newTranslation = {
            originalText,
            translatedText,
            sourceLanguage,
            targetLanguage,
            timestamp: new Date()
        };

        user.translationHistory.push(newTranslation);
        await user.save();

        console.log('Traducción guardada exitosamente');

        return NextResponse.json({
            success: true,
            message: 'Translation added to history',
            translation: newTranslation
        });

    } catch (error) {
        console.error('Error adding translation to history:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}