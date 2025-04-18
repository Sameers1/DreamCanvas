import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-placeholder-key" });

// Generate image from prompt
export async function generateImage(prompt: string): Promise<string> {
  try {
    const enhancedPrompt = `Create a dreamlike visualization with ethereal quality: ${prompt}. Highly detailed, mystical atmosphere, fantasy art, 4K, trending on artstation, ultra realistic, cinematic lighting, hyper detailed.`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    
    // Return a fallback image URL for development/testing
    // In production, we would handle this differently
    return "https://images.unsplash.com/photo-1534447677768-be436bb09401";
  }
}

// Extract key elements from the dream description
export async function extractElementsFromText(text: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Extract 3-5 key elements or themes from the dream description. Return just a JSON array of strings. Each element should be a single word or short phrase.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return Array.isArray(result.elements) ? result.elements : [];
  } catch (error) {
    console.error("Error extracting elements:", error);
    
    // Return some default elements for development/testing
    // In production, we would handle this differently
    return ["dreaming", "visualization", "ethereal"];
  }
}
