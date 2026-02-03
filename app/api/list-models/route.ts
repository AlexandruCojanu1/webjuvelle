import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key;

        if (!apiKey) {
            return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
