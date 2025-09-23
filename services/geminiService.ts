import { GoogleGenAI, Type } from "@google/genai";

// Fix: Use process.env.API_KEY as per the coding guidelines. This resolves the error "Property 'env' does not exist on type 'ImportMeta'".
const apiKey = process.env.API_KEY;

if (!apiKey) {
  // Fix: Update error message to reflect the correct environment variable.
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        description: {
            type: Type.STRING,
            description: "A concise but descriptive summary of the meal identified (e.g., 'Two fried eggs with whole wheat toast')."
        },
        totalCalories: {
            type: Type.INTEGER,
            description: "The estimated total calorie count for the meal as a single integer."
        },
        breakdown: {
            type: Type.ARRAY,
            description: "A breakdown of each food item identified and its estimated calories.",
            items: {
                type: Type.OBJECT,
                properties: {
                    item: { type: Type.STRING, description: "The name of the individual food item." },
                    calories: { type: Type.INTEGER, description: "The estimated calories for this specific item." }
                },
                required: ["item", "calories"]
            }
        }
    },
    required: ["description", "totalCalories", "breakdown"]
};

const systemInstruction = `You are a nutrition expert. Analyze the user's meal from the text or image. Identify the food items, estimate their individual caloric content, and then calculate the total. Respond in a valid JSON format according to the provided schema. Provide a 'description' of the meal, the 'totalCalories', and a 'breakdown' array listing each item and its calories.`;

function fileToGenerativePart(file: File) {
  return new Promise<{ inlineData: { data: string; mimeType: string; } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as base64 string"));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export interface FoodItemBreakdown {
    item: string;
    calories: number;
}

export interface CalorieEstimation {
    description: string;
    totalCalories: number;
    breakdown: FoodItemBreakdown[];
}

const parseAndValidateResponse = (responseText: string): CalorieEstimation => {
    try {
        // Gemini may sometimes wrap the JSON in ```json ... ```
        const sanitizedText = responseText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(sanitizedText);

        const isValidBreakdown = Array.isArray(parsed.breakdown) && parsed.breakdown.every(
            (item: any) => typeof item.item === 'string' && typeof item.calories === 'number'
        );

        if (typeof parsed.description === 'string' && typeof parsed.totalCalories === 'number' && parsed.totalCalories >= 0 && isValidBreakdown) {
            return parsed;
        }
        throw new Error("Invalid response structure from API");
    } catch (e) {
        console.error("Failed to parse or validate API response:", responseText, e);
        throw new Error("Could not understand the calorie estimation from the AI.");
    }
}

export const getCaloriesFromText = async (description: string): Promise<CalorieEstimation> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: description,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    return parseAndValidateResponse(response.text);
  } catch (error) {
    console.error("Error fetching calories from text:", error);
    throw new Error("Failed to estimate calories from text.");
  }
};

export const getCaloriesFromImage = async (imageFile: File): Promise<CalorieEstimation> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart] },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    
    return parseAndValidateResponse(response.text);
  } catch (error) {
    console.error("Error fetching calories from image:", error);
    throw new Error("Failed to estimate calories from image.");
  }
};