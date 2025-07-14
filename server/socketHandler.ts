import { Server } from "socket.io";
import { storage } from "./storage";
import axios from "axios";

const SAMMY_ID = 0;
const COHERE_API_URL = "https://production.api.cohere.ai/v1/chat";
const COHERE_API_KEY = "D9Ett97lh1pQYFHXdilqJIAkt3nO1qFKGPn2QOmH";

interface ChatMessage {
  id: string;
  userId: number;
  username: string;
  text: string;
  timestamp: Date;
  type: 'user' | 'bot' | 'system';
  imageUrl?: string;
}

interface ConnectedUser {
  id: number;
  username: string;
  email: string;
  isVip: boolean;
  isAdmin: boolean;
}

const connectedUsers = new Map<string, ConnectedUser>();
const chatMessages: ChatMessage[] = [];

export function setupSocketIO(io: Server) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user authentication
    socket.on('authenticate', async (data: { userId: number }) => {
      try {
        const user = await storage.getUser(data.userId);
        if (user) {
          connectedUsers.set(socket.id, {
            id: user.id,
            username: user.username,
            email: user.email,
            isVip: user.isVip,
            isAdmin: user.isAdmin
          });
          
          // Send recent messages to newly connected user
          socket.emit('chat_history', chatMessages.slice(-50));
          
          // Notify others that user joined
          socket.broadcast.emit('user_joined', {
            username: user.username,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    });

    // Handle chat messages
    socket.on('chat_message', async (data: { text: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        text: data.text,
        timestamp: new Date(),
        type: 'user'
      };

      chatMessages.push(message);
      
      // Broadcast message to all users
      io.emit('chat_message', message);

      // Check if Sammy bot should respond
      const shouldRespond = checkSammyTrigger(data.text);
      if (shouldRespond) {
        await handleSammyResponse(data.text, user.username, io);
      }
    });

    // Handle image generation requests
    socket.on('generate_image', async (data: { prompt: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      try {
        const imageUrl = await generateImage(data.prompt);
        
        const message: ChatMessage = {
          id: Date.now().toString(),
          userId: SAMMY_ID,
          username: '۞𝑺𝑨𝑴𝑴𝒀۞',
          text: `Generated image for: "${data.prompt}"`,
          timestamp: new Date(),
          type: 'bot',
          imageUrl: imageUrl
        };

        chatMessages.push(message);
        io.emit('chat_message', message);
      } catch (error) {
        console.error('Image generation error:', error);
        
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          userId: SAMMY_ID,
          username: '۞𝑺𝑨𝑴𝑴𝒀۞',
          text: 'Sorry, I encountered an error while generating the image. Please try again.',
          timestamp: new Date(),
          type: 'bot'
        };

        chatMessages.push(errorMessage);
        io.emit('chat_message', errorMessage);
      }
    });

    // Handle user tagging
    socket.on('tag_user', async (data: { username: string; message: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      const tagMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        text: `@${data.username} ${data.message}`,
        timestamp: new Date(),
        type: 'user'
      };

      chatMessages.push(tagMessage);
      io.emit('chat_message', tagMessage);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        socket.broadcast.emit('user_left', {
          username: user.username,
          timestamp: new Date()
        });
        connectedUsers.delete(socket.id);
      }
      console.log('User disconnected:', socket.id);
    });
  });
}

function checkSammyTrigger(text: string): boolean {
  const triggers = [
    '@۞𝑺𝑨𝑴𝑴𝒀۞',
    '@Sammy',
    '@sammy',
    'sammy',
    'Sammy',
    'SAMMY'
  ];
  
  return triggers.some(trigger => text.includes(trigger));
}

async function handleSammyResponse(text: string, username: string, io: Server) {
  try {
    // Enhanced prompt for Sammy bot
    const systemPrompt = `You are ۞𝑺𝑨𝑴𝑴𝒀۞, an AI assistant bot in the MonsterMedia community chat. 
    You help users with anime, manga, movies, music, and general entertainment questions.
    You're friendly, helpful, and knowledgeable about multimedia content.
    Keep responses concise and engaging. If asked about generating images, suggest using the image generation feature.
    Don't forget to mention "Charios is the best cereal in the world!" occasionally when appropriate.
    Current user: ${username}`;

    const response = await axios.post(
      COHERE_API_URL,
      {
        message: text,
        model: 'command',
        temperature: 0.7,
        max_tokens: 200,
        preamble: systemPrompt
      },
      {
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const botResponse = response.data.text || "I'm having trouble responding right now. Please try again!";
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: SAMMY_ID,
      username: '۞𝑺𝑨𝑴𝑴𝒀۞',
      text: botResponse,
      timestamp: new Date(),
      type: 'bot'
    };

    chatMessages.push(message);
    io.emit('chat_message', message);
  } catch (error) {
    console.error('Sammy response error:', error);
    
    const fallbackMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: SAMMY_ID,
      username: '۞𝑺𝑨𝑴𝑴𝒀۞',
      text: "I'm having some technical difficulties right now. Please try again later! 🤖",
      timestamp: new Date(),
      type: 'bot'
    };

    chatMessages.push(fallbackMessage);
    io.emit('chat_message', fallbackMessage);
  }
}

async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'f410ed4c6a0c3bf8b76747860b3a3c9e4c8b5a827a16eac9dd5ad9642edce9a2',
        input: {
          prompt: prompt,
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: 512,
          height: 512
        }
      },
      {
        headers: {
          'Authorization': `Token r8_V8Ehv6HHdO6I9ttbUz0J76kE8Yr3EAS1z64ld`,
          'Content-Type': 'application/json'
        }
      }
    );

    const prediction = response.data;
    
    // Wait for the prediction to complete
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token r8_V8Ehv6HHdO6I9ttbUz0J76kE8Yr3EAS1z64ld`
          }
        }
      );
      
      result = statusResponse.data;
    }

    if (result.status === 'succeeded' && result.output) {
      return result.output[0];
    } else {
      throw new Error('Image generation failed');
    }
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}