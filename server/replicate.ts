import Replicate from 'replicate';

// Initialize the Replicate client with the API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Generates an image using Replicate's Stable Diffusion model based on a prompt
 * @param prompt The text prompt describing the image to generate
 * @returns URL to the generated image
 */
export async function generateImage(prompt: string): Promise<string> {
  try {
    console.log('Generating image with Replicate using prompt:', prompt);
    
    // Use a publicly available Stable Diffusion model
    // Model: cjwbw/dreamshaper
    const output = await replicate.run(
      "cjwbw/dreamshaper:ed6d8bee9a278b0d7125872bddfb9dd3fc4c401426ad634d8246a660e387475b",
      {
        input: {
          prompt: prompt + ", dreamlike, high quality, detailed",
          width: 768,
          height: 768,
          num_inference_steps: 30,
          guidance_scale: 7,
          negative_prompt: "low quality, bad anatomy, blurry, pixelated, distorted proportions, disfigured, watermark, signature, ugly"
        }
      }
    );
    
    // The output is an array of image URLs, we take the first one
    if (Array.isArray(output) && output.length > 0) {
      console.log('Image generated successfully:', output[0]);
      return output[0] as string;
    } else {
      throw new Error('No output received from Replicate');
    }
  } catch (error) {
    console.error('Error generating image with Replicate:', error);
    throw error;
  }
}

/**
 * Processes a dream description to extract the key elements using OpenAI
 * This will continue to use OpenAI for text analysis if available, but will provide
 * fallback functionality if the OpenAI API isn't working
 * @param text The dream description text
 * @returns An array of key elements extracted from the text
 */
export async function extractElementsFromText(text: string): Promise<string[]> {
  try {
    // Try to use OpenAI for extracting elements if it's available
    try {
      // Import dynamically to not fail if OpenAI API has issues
      const { extractElementsFromText } = await import('./openai');
      return await extractElementsFromText(text);
    } catch (e) {
      console.log('Using fallback method for extracting elements: ', e);
      // Fallback: Simple keyword extraction based on common nouns and adjectives
      // This is a very basic implementation but will work without API dependencies
      
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
      return uniqueWords.slice(0, 5);
    }
  } catch (error) {
    console.error('Error extracting elements from text:', error);
    // Return empty array as fallback
    return [];
  }
}