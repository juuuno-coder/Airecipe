import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key is missing" }, { status: 500 });
    }

    const body = await req.json();
    const { ingredients, cuisine, restriction } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a professional chef. Create a unique and delicious recipe based on the following available ingredients and preferences.
      
      Ingredients: ${ingredients}
      Cuisine Style: ${cuisine || "Any"}
      Dietary Restrictions: ${restriction || "None"}

      Please return the response in the following JSON format ONLY, without any additional text or markdown formatting:
      {
        "title": "Recipe Title",
        "description": "A brief, appetizing description of the dish.",
        "cooking_time_minutes": 30,
        "difficulty": "Easy" | "Medium" | "Hard",
        "ingredients": [
          { "item": "Ingredient Name", "quantity": "Quantity (e.g., 200g, 1 cup)" }
        ],
        "instructions": [
          "Step 1 description...",
          "Step 2 description..."
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown if present (e.g. ```json ... ```)
    const jsonStr = text.replace(/```json|```/g, "").trim();
    
    try {
      const recipe = JSON.parse(jsonStr);
      return NextResponse.json(recipe);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      return NextResponse.json({ error: "Failed to generate valid JSON format" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}
