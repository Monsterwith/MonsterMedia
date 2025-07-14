import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Image, Users, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessage {
  id: string;
  userId: number;
  username: string;
  text: string;
  timestamp: Date;
  type: 'user' | 'bot' | 'system';
  imageUrl?: string;
}

interface CommunityChat {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityChat({ isOpen, onClose }: CommunityChat) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [imagePrompt, setImagePrompt] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      // Initialize socket connection
      const newSocket = io();
      setSocket(newSocket);

      // Connection event handlers
      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('authenticate', { userId: user.id });
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      // Chat event handlers
      newSocket.on('chat_history', (history: ChatMessage[]) => {
        setMessages(history);
      });

      newSocket.on('chat_message', (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('user_joined', (data: { username: string }) => {
        const systemMessage: ChatMessage = {
          id: Date.now().toString(),
          userId: -1,
          username: 'System',
          text: `${data.username} joined the chat`,
          timestamp: new Date(),
          type: 'system'
        };
        setMessages(prev => [...prev, systemMessage]);
      });

      newSocket.on('user_left', (data: { username: string }) => {
        const systemMessage: ChatMessage = {
          id: Date.now().toString(),
          userId: -1,
          username: 'System',
          text: `${data.username} left the chat`,
          timestamp: new Date(),
          type: 'system'
        };
        setMessages(prev => [...prev, systemMessage]);
      });

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isOpen, user]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket && inputMessage.trim() && user) {
      socket.emit('chat_message', { text: inputMessage });
      setInputMessage('');
    }
  };

  const generateImage = () => {
    if (socket && imagePrompt.trim()) {
      socket.emit('generate_image', { prompt: imagePrompt });
      setImagePrompt('');
      setShowImageInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateImage();
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getUserAvatar = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const isSammyBot = (userId: number) => userId === 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] mx-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Community Chat
              <Badge variant="secondary" className="ml-2">
                <Users className="w-3 h-3 mr-1" />
                {onlineUsers} online
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full">
          {/* Messages Area */}
          <ScrollArea className="flex-1 mb-4 border rounded-lg p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'system' ? 'justify-center' : 'justify-start'
                  }`}
                >
                  {message.type !== 'system' && (
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback
                        className={`${
                          isSammyBot(message.userId)
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {isSammyBot(message.userId) ? '🤖' : getUserAvatar(message.username)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex-1 ${message.type === 'system' ? 'text-center' : ''}`}>
                    {message.type === 'system' ? (
                      <div className="text-sm text-muted-foreground italic">
                        {message.text}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium text-sm ${
                            isSammyBot(message.userId) ? 'text-purple-500' : 'text-foreground'
                          }`}>
                            {message.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm text-foreground mb-2">
                          {message.text}
                        </div>
                        {message.imageUrl && (
                          <div className="mt-2">
                            <img
                              src={message.imageUrl}
                              alt="Generated image"
                              className="max-w-xs rounded-lg shadow-md"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Image Generation Input */}
          {showImageInput && (
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Describe the image you want to generate..."
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                onKeyPress={handleImageKeyPress}
                className="flex-1"
              />
              <Button onClick={generateImage} size="sm">
                Generate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageInput(false)}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder={`Message as ${user?.username}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
              disabled={!isConnected}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowImageInput(true)}
              disabled={!isConnected}
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Chat Tips */}
          <div className="mt-2 text-xs text-muted-foreground">
            Tip: Tag users with @username or summon Sammy with @sammy or @۞𝑺𝑨𝑴𝑴𝒀۞
          </div>
        </CardContent>
      </Card>
    </div>
  );
}