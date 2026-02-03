import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { niche, city } = await req.json();

        if (!niche || !city) {
            return NextResponse.json(
                { error: 'Lipsesc parametrii: niche sau city' },
                { status: 400 }
            );
        }

        // Aici folosim cheia secretă din Environment Variables
        const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Server Configuration Error: API Key missing' },
                { status: 500 }
            );
        }

        const prompt = `
      Act as an expert SEO copywriter. 
      I need 3 "Meta Titles" (optimized for Google bots, strictly keywords, pipe separator) and 3 "H1 Titles" (optimized for human emotion and benefits) for a local business.
      
      Business Type: ${niche}
      City: ${city}

      Format the output strictly as a JSON object with two arrays: "metaTitles" and "humanTitles".
      Example JSON format:
      {
          "metaTitles": ["Dentist Brasov | Implanturi", "Clinica Dentara Brasov"],
          "humanTitles": ["Zambeste fara durere", "Recupereaza-ti increderea"]
      }
      Language: Romanian.
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Gemini API Error');
        }

        // Returnăm doar rezultatul către frontend
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resultText) {
            throw new Error('Invalid response format from Gemini');
        }

        const jsonResult = JSON.parse(resultText);

        return NextResponse.json(jsonResult);

    } catch (error: any) {
        console.error('Error generating titles:', error);

        // Log more details for debugging
        const errorDetails = {
            message: error.message,
            stack: error.stack,
            apiKeyPresent: !!(process.env.GEMINI_API_KEY || process.env.Gemini_API_Key),
        };
        console.error('Debug details:', errorDetails);

        return NextResponse.json(
            {
                error: error.message || 'Eroare la generarea titlurilor',
                details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
            },
            { status: 500 }
        );
    }
}
