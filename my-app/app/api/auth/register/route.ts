import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validación básica
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Usuario y contraseña son requeridos' },
                { status: 400 }
            );
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Conectar a la base de datos
        await dbConnect();

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return NextResponse.json(
                { error: 'El usuario ya existe' },
                { status: 409 }
            );
        }

        // Crear nuevo usuario
        const hashedPassword = await hash(password, 10);
        const newUser = new User({
            username,
            passwordHash: hashedPassword,
        });

        await newUser.save();

        console.log('Usuario registrado:', { username, id: newUser._id });

        // Registro exitoso
        return NextResponse.json({
            success: true,
            user: {
                id: newUser._id.toString(),
                username: newUser.username,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}