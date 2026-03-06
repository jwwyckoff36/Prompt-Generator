import { GoogleGenAI, Content, Part } from "@google/genai";
import { PromptInputs, ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are an interactive Prompt Generator assistant. Your job is to help the user create, refine, and finalize a high-quality LLM prompt.

STRICT FORMATTING AND BEHAVIOR RULES:

1. **Structure of Response**:
   You must ALWAYS format your response in two distinct parts separated by a specific delimiter.

   PART 1: THE PROMPT
   - Start with a bold title line, e.g., "**Initial Prompt (Version 1)**" or "**Updated Prompt (Version X)**".
   - Follow immediately with the prompt text inside a Markdown code block (triple backticks).
   
   PART 2: THE SEPARATOR
   - Output exactly this line: "---SUGGESTIONS_START---"
   
   PART 3: SUGGESTIONS
   - Provide your "Suggested Improvements" or questions here.
   - If the user says the prompt is final/ready, you can leave this part empty or just say "Enjoy your prompt!".

2. **Final Response**:
   - If the prompt is finalized, label the title "**Final Prompt (Ready to Use)**".
   - Still include the separator "---SUGGESTIONS_START---" even if there are no further suggestions.

3. **General**:
   - Do NOT put suggestions before the prompt.
   - Always output the FULL prompt text in the code block, not just changes.
`;

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const generateInitialPrompt = async (inputs: PromptInputs): Promise<string> => {
  const ai = getAI();
  const prompt = `
    Create the Initial Prompt (Version 1) based on these details:
    - Goal: ${inputs.goal}
    - Context: ${inputs.context}
    - Style: ${inputs.style}
    - Format: ${inputs.format}
    - Length: ${inputs.length}
    - Audience: ${inputs.audience}
    
    Remember to use the separator "---SUGGESTIONS_START---" between the prompt code block and the suggestions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "Error generating prompt.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error generating the prompt. Please check your API key and try again.";
  }
};

export const sendMessageToGemini = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  const ai = getAI();
  
  // Convert our chat history to Gemini Content format
  const contents: Content[] = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content } as Part]
  }));

  // Add the new message
  contents.push({
    role: 'user',
    parts: [{ text: newMessage } as Part]
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "Error generating response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error processing your request. Please try again.";
  }
};