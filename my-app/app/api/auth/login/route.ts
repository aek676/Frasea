import { NextResponse } from 'next/server';
import { dbConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import { compare } from 'bcryptjs';

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

    console.log('Intentando conectar a la base de datos...');

    // Conectar a la base de datos
    await dbConnect();

    console.log('Conexión a la base de datos exitosa, buscando usuario:', username);

    const existingUser = await User.findOne({ username });

    console.log('Login attempt:', { username, userFound: !!existingUser });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const isPasswordValid = await compare(password, existingUser.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'INVALID_PASSWORD' },
        { status: 401 }
      );
    }

    // Login exitoso
    return NextResponse.json({
      success: true,
      user: {
        id: existingUser._id.toString(),
        username: existingUser.username,
        createdAt: existingUser.createdAt,
      }
    });

  } catch (error) {
    console.error('Error en login:', error);

    // Proporcionar información más detallada sobre el error
    const errorMessage = error instanceof Error
      ? `Error: ${error.message}`
      : 'Error interno del servidor';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
