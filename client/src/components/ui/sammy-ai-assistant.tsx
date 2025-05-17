import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Send, X, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Interface for message objects
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function SammyAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Generate a unique ID for messages
  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initial greeting when opening the assistant for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: generateId(),
          role: 'assistant',
          content: `Hello${user ? ` ${user.username}` : ''}! I'm ۞𝑺𝑨𝑴𝑴𝒀۞, your personal assistant on MONSTERWITH. How can I help you discover amazing anime, manga, music, or movies today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, user]);

  // Process user input and get response
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send message to OpenAI API
      let assistantResponse = '';
      
      if (process.env.OPENAI_API_KEY) {
        try {
          // Send actual request to OpenAI through your backend
          const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: input,
              history: messages.map(m => ({ role: m.role, content: m.content }))
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to get response');
          }
          
          const data = await response.json();
          assistantResponse = data.response;
        } catch (error) {
          console.error('Error with AI service:', error);
          assistantResponse = "I'm having trouble connecting to my thinking systems right now. Please try again later!";
        }
      } else {
        // Fallback responses if OpenAI API is not available
        const fallbackResponses = [
          "I'd recommend checking out 'Demon Slayer' if you enjoy action-packed anime with beautiful animation!",
          "Have you tried our VIP section? It has exclusive content you might enjoy.",
          "Based on your interests, you might enjoy exploring our music collection from Japanese artists.",
          "I can help you discover new content! Try searching for a specific genre or title.",
          "Our recently added movies section has some great new additions worth checking out!",
          "Did you know you can create a profile to save your favorite content for easy access later?",
          "I'm ۞𝑺𝑨𝑴𝑴𝒀۞, here to make your experience on MONSTERWITH even better!"
        ];
        
        assistantResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your message.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-primary hover:bg-primary/80 shadow-lg flex items-center justify-center"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 flex items-center gap-2">
        <Button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/80 shadow-lg"
        >
          <span className="font-bold">۞𝑺𝑨𝑴𝑴𝒀۞</span>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl flex flex-col overflow-hidden border-primary/20">
      <CardHeader className="bg-primary/10 py-3 px-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>۞𝑺𝑨𝑴𝑴𝒀۞</span>
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-8 w-8 rounded-full">
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full text-destructive">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 border-2 border-primary">
                <div className="flex h-full w-full items-center justify-center bg-primary text-white text-xs font-bold">
                  S
                </div>
              </Avatar>
            )}
            <div
              className={`max-w-[75%] rounded-xl p-3 ${
                message.role === 'assistant'
                  ? 'bg-muted text-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <Avatar className="h-8 w-8">
                <div className="flex h-full w-full items-center justify-center bg-secondary text-white text-xs font-bold">
                  {user ? user.username.substring(0, 1).toUpperCase() : 'U'}
                </div>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ۞𝑺𝑨𝑴𝑴𝒀۞..."
            className="min-h-10 resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            className="rounded-full h-10 w-10 p-0 flex-shrink-0"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}