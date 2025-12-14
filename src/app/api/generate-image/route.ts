import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // -------------------------------------------------------------------------
    // [FUTURE INTEGRATION POINT]
    // Later, you can replace the logic below with your Gemini 3 Pro App API call.
    // Example:
    // const response = await fetch("YOUR_GEMINI_APP_URL", { 
    //   method: "POST", 
    //   body: JSON.stringify({ text: prompt }) 
    // });
    // const imageUrl = (await response.json()).url;
    // -------------------------------------------------------------------------

    // [CURRENT DEMO IMPLEMENTATION]
    // Using Pollinations AI (Free, No Key) for immediate visual feedback.
    // It generates images based on the URL text.
    
    const enhancedPrompt = `High quality, delicious food photography, ${prompt}, professional lighting, 4k`;
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    
    // Generate a random seed to ensure different images for same prompts if retried
    const randomSeed = Math.floor(Math.random() * 10000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;

    // In a real production app with your own model, you might upload this image to Supabase Storage here.
    // For now, we return the direct URL.

    return NextResponse.json({ url: imageUrl });

  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
