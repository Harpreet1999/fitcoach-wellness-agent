import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const result = await model.generateContent([
      `Create a clean, motivational fitness illustration for: ${prompt}. Style: minimal, monochromatic, professional fitness photography aesthetic. No text overlays.`,
    ]);

    const response = result.response;
    const imagePart = response.candidates?.[0]?.content.parts.find(p => p.inlineData);

    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    return NextResponse.json({
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    });
  } catch (err: unknown) {
    console.error('Image gen error:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
