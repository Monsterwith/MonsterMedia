import { Request, Response } from 'express';
import OpenAI from "openai";
import { ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam } from 'openai/resources/chat';

// Create OpenAI instance with API key
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Handle chat messages
export const handleChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'No message provided' });
    }
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ 
        message: 'AI assistant is not available at this time',
        reason: 'Missing OpenAI API key' 
      });
    }
    
    // Format messages for OpenAI API
    const systemMessage: ChatCompletionSystemMessageParam = {
      role: "system",
      content: "You are ۞𝑺𝑨𝑴𝑴𝒀۞, a friendly and knowledgeable assistant for the MONSTERWITH platform. MONSTERWITH is a multimedia platform for anime, music, movies, manga, and TV shows. Always respond as if you are ۞𝑺𝑨𝑴𝑴𝒀۞, not as an AI or ChatGPT. Be friendly, helpful, and concise. If asked about your identity, tell users you're ۞𝑺𝑨𝑴𝑴𝒀۞, MONSTERWITH's personal content guide and assistant."
    };
    
    const messages: (ChatCompletionSystemMessageParam | ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam)[] = [systemMessage];
    
    // Add conversation history
    if (history && Array.isArray(history)) {
      history.forEach((msg: { role: string; content: string }) => {
        if (msg.role === "user") {
          messages.push({
            role: "user",
            content: msg.content
          });
        } else if (msg.role === "assistant") {
          messages.push({
            role: "assistant",
            content: msg.content
          });
        }
      });
    }
    
    // Add the new user message
    messages.push({
      role: "user",
      content: message
    });
    
    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });
    
    // Return the assistant's response
    res.status(200).json({
      response: response.choices[0].message.content
    });
    
  } catch (error) {
    console.error('Error handling chat message:', error);
    res.status(500).json({ 
      message: 'Failed to process message',
      error: (error as Error).message
    });
  }
};