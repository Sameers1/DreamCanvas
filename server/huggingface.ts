import fetch from 'node-fetch';

/**
 * Generates an image using Hugging Face's API based on a text prompt
 * @param prompt The text prompt describing the image to generate
 * @returns A string with the generated image URL (data URL or hosted URL)
 */
export async function generateImage(prompt: string): Promise<string> {
  try {
    console.log('Generating image with Hugging Face using prompt:', prompt);
    
    // Use a model that's supported by the Hugging Face inference API
    // Make sure to use a model that's deployed for inference
    const model = "prompthero/openjourney";  // This is a Midjourney-style model that's available on HF
    const apiUrl = `https://api-inference.huggingface.co/models/${model}`;
    
    // Make API call to Hugging Face
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `mdjrny-v4 style ${prompt}, 8k detailed, realistic, trending on artstation, fantasy concept art, beautiful, masterpiece`,
        parameters: {
          negative_prompt: "low quality, bad anatomy, blurry, pixelated, deformed, watermark"
        }
      })
    });
    
    if (!response.ok) {
      let errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} ${errorText}`);
    }
    
    // The response is the binary image data
    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const dataUrl = `data:${contentType};base64,${base64}`;
    
    console.log('Image generated successfully with Hugging Face');
    return dataUrl;
  } catch (error) {
    console.error('Error generating image with Hugging Face:', error);
    
    // If Hugging Face fails, try to use a fallback method (mock image)
    console.log('Using fallback image generation method');
    return generateFallbackImage(prompt);
  }
}

/**
 * Creates a simple placeholder image as a fallback when API fails
 * @param prompt The original prompt (used for tracking)
 * @returns A data URL for a simple generated SVG image
 */
function generateFallbackImage(prompt: string): string {
  // Generate a placeholder SVG with gradient background
  // This is only used if both the primary and secondary image services fail
  const colors = ['6B46C1', '9F7AEA', '76E4F7', 'FF63C3']; 
  const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
  const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
  
  // Escape prompt text for XML
  const escapedPrompt = prompt
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  
  // Create a more detailed SVG with the dream prompt text
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${randomColor1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${randomColor2};stop-opacity:1" />
        </linearGradient>
        <filter id="noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="compositedNoise"/>
        </filter>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite operator="over" in="blur" in2="SourceGraphic" />
        </filter>
      </defs>
      <rect width="512" height="512" fill="url(#grad)" />
      <rect width="512" height="512" fill="url(#grad)" filter="url(#noise)" opacity="0.3" />
      <circle cx="256" cy="256" r="100" fill="none" stroke="white" stroke-width="2" opacity="0.7" />
      <circle cx="256" cy="256" r="150" fill="none" stroke="white" stroke-width="1" opacity="0.5" />
      <text x="50%" y="200" font-family="Arial" font-size="28" fill="white" text-anchor="middle" filter="url(#glow)">Dream Visualization</text>
      <text x="50%" y="250" font-family="Arial" font-size="16" fill="white" text-anchor="middle" opacity="0.9">Dreamlike image of</text>
      <foreignObject x="56" y="270" width="400" height="150">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; font-size: 14px; color: white; text-align: center; overflow-wrap: break-word;">
          ${escapedPrompt}
        </div>
      </foreignObject>
    </svg>
  `;
  
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return dataUrl;
}

/**
 * Extracts elements from the text using a simple algorithm
 * @param text The dream description text
 * @returns An array of key elements extracted from the text
 */
export function extractElementsFromText(text: string): Promise<string[]> {
  try {
    // Split the text into words and filter out common stop words
    const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
    const stopWordsArray = [
      'the', 'and', 'a', 'an', 'of', 'to', 'in', 'that', 'it', 'with',
      'for', 'as', 'was', 'on', 'at', 'by', 'from', 'is', 'was', 'were',
      'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'but', 'or', 'if', 'then', 'else', 'when', 'up', 'down', 'i', 'my',
      'myself', 'we', 'our', 'ourselves', 'you', 'your', 'yourself',
      'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
      'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'themselves'
    ];
    const stopWords = new Set<string>();
    stopWordsArray.forEach(word => stopWords.add(word));
    
    // Get unique words that aren't stop words
    const filteredWords = words.filter(word => 
      word.length > 3 && !stopWords.has(word)
    );
    const uniqueWords = Array.from(new Set(filteredWords));
    
    // Return up to 5 unique "interesting" words
    return Promise.resolve(uniqueWords.slice(0, 5));
  } catch (error) {
    console.error('Error extracting elements from text:', error);
    // Return empty array as fallback
    return Promise.resolve([]);
  }
}