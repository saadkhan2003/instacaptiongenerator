import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Google AI
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

async function generateWithGemini(prompt: string) {
  const model = googleAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function generateWithDeepseek(prompt: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/saadkhan955/instacapgen',
      'X-Title': 'InstaCap Generator'
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1-distill-qwen-32b:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(req: Request) {
  try {
    const { content, tone, industry, model } = await req.json();

    const prompt = `Generate 3 engaging Instagram captions for a ${industry} post with a ${tone} tone. 
    The post is about: ${content}
    
    Generate each caption with relevant hashtags. Make them unique and creative. Format the response as plain text with each caption separated by "---" on its own line.`;

    let captions;
    if (model === 'gemini') {
      captions = await generateWithGemini(prompt);
    } else {
      captions = await generateWithDeepseek(prompt);
    }

    // Clean up and format the captions
    const formattedCaptions = captions
      .split('---')
      .map(caption => caption.trim())
      .filter(caption => caption.length > 0);

    return NextResponse.json({ captions: formattedCaptions });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate captions' },
      { status: 500 }
    );
  }
}