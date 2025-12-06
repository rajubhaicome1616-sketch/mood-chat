import { GoogleGenAI, Type } from "@google/genai";
import { Message, Mood, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const flashLite = 'gemini-flash-lite-latest';
const flash = 'gemini-2.5-flash';
const pro = 'gemini-2.5-pro';
const imagen = 'imagen-4.0-generate-001';

export const getDirectResponse = async (prompt: string): Promise<Message> => {
    const response = await ai.models.generateContent({
        model: flash,
        contents: prompt,
    });

    return {
        id: Date.now().toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
    };
};

export const getChatResponse = async (history: Message[], newMessage: string): Promise<Message> => {
    const model = ai.models.generateContent;
    
    const formattedHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    const response = await model({
        model: flash,
        contents: [...formattedHistory, { role: 'user', parts: [{ text: newMessage }] }],
    });

    return {
        id: Date.now().toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
    };
};

export const analyzeMood = async (text: string): Promise<Mood> => {
    try {
        const response = await ai.models.generateContent({
            model: flashLite,
            contents: `Analyze the mood of this text: "${text}". Respond with only one of these words: happy, sad, angry, neutral.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        mood: {
                            type: Type.STRING,
                            enum: ['happy', 'sad', 'angry', 'neutral']
                        }
                    }
                }
            }
        });
        const json = JSON.parse(response.text);
        const mood = json.mood.toLowerCase();
        
        if (Object.values(Mood).includes(mood)) {
            return mood as Mood;
        }
        return Mood.Neutral;
    } catch (e) {
        console.error("Mood analysis failed, falling back to neutral:", e);
        return Mood.Neutral;
    }
};

export const getSmartReplies = async (messages: Message[]): Promise<string[]> => {
    try {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.sender === 'user') return [];
        
        const prompt = `Based on this last message from a chat bot: "${lastMessage.text}", generate three very short, concise, and relevant reply suggestions for a user.`;
        
        const response = await ai.models.generateContent({
            model: flashLite,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        replies: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                    },
                },
            },
        });

        const json = JSON.parse(response.text);
        return json.replies || [];
    } catch (e) {
        console.error("Smart reply generation failed:", e);
        return [];
    }
};

export const getEmojiSuggestions = async (mood: Mood): Promise<string[]> => {
    try {
        const prompt = `Based on a "${mood}" mood, suggest four relevant emojis.`;
        const response = await ai.models.generateContent({
            model: flashLite,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        emojis: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: 'A single emoji character'
                            }
                        }
                    }
                }
            }
        });
        const json = JSON.parse(response.text);
        return json.emojis || [];
    } catch (e) {
        console.error("Emoji suggestion generation failed:", e);
        return [];
    }
};

export const getGroundedResponse = async (prompt: string): Promise<Message> => {
    const response = await ai.models.generateContent({
        model: flash,
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
        .map((chunk: any) => ({
            uri: chunk.web?.uri,
            title: chunk.web?.title,
        }))
        .filter((source: GroundingSource) => source.uri);

    return {
        id: Date.now().toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        sources: sources,
    };
};

export const generateImage = async (prompt: string): Promise<Message> => {
    try {
        const response = await ai.models.generateImages({
            model: imagen,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            }
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64Image = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64Image}`;
            return {
                id: Date.now().toString(),
                text: `Here's your image for: "${prompt}"`,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString(),
                imageUrl: imageUrl,
            };
        } else {
             throw new Error("No image generated");
        }
    } catch (error) {
        console.error("Image generation failed:", error);
        return {
            id: Date.now().toString(),
            text: "Sorry, I couldn't create that image. Please try a different prompt.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString(),
        };
    }
};