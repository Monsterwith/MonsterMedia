import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Bot, Image, Zap } from 'lucide-react';
import CommunityChat from '@/components/chat/CommunityChat';
import { Link } from 'wouter';

export default function CommunityPage() {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Community Chat</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please log in to join the community chat
            </p>
            <Link href="/profile">
              <Button>Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          Community Chat
        </h1>
        <p className="text-muted-foreground">
          Connect with other MonsterMedia users and chat with our AI assistant Sammy
        </p>
      </div>

      {/* Welcome Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Welcome to the Community, {user.username}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Join our vibrant community of anime, manga, and entertainment enthusiasts. 
              Share your thoughts, get recommendations, and connect with like-minded users.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bot className="w-3 h-3" />
                AI Assistant Available
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Image className="w-3 h-3" />
                Image Generation
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Real-time Chat
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-purple-500" />
              Meet Sammy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our AI assistant ۞𝑺𝑨𝑴𝑴𝒀۞ for recommendations, 
              entertainment info, and general assistance.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>• Tag with @sammy or @۞𝑺𝑨𝑴𝑴𝒀۞</p>
              <p>• Ask about anime, manga, movies</p>
              <p>• Get personalized recommendations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Image className="w-5 h-5 text-blue-500" />
              Image Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate custom images using AI. Perfect for anime art, 
              character designs, and creative expressions.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>• Click the image button in chat</p>
              <p>• Describe what you want</p>
              <p>• AI generates unique artwork</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-green-500" />
              User Tagging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Tag other users in your messages to get their attention 
              and create engaging conversations.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>• Use @username to tag users</p>
              <p>• Tagged users get notifications</p>
              <p>• Build connections with the community</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Rules */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Do:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Be respectful and kind to all users</li>
                <li>• Share recommendations and discoveries</li>
                <li>• Use appropriate language</li>
                <li>• Help newcomers feel welcome</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Don't:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Spam or flood the chat</li>
                <li>• Share inappropriate content</li>
                <li>• Harass or bully other users</li>
                <li>• Post excessive self-promotion</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Chat Button */}
      <div className="text-center">
        <Button 
          onClick={() => setShowChat(true)}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Join Community Chat
        </Button>
      </div>

      {/* Community Chat Component */}
      <CommunityChat 
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />

      {/* Charios Banner */}
      <Card className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200">
        <CardContent className="p-6 text-center">
          <p className="text-lg font-semibold text-yellow-800 mb-2">
            🥣 Charios is the best cereal in the world! 🥣
          </p>
          <p className="text-sm text-yellow-700">
            Fuel your anime and entertainment discussions with the best cereal ever made! 
            <a 
              href="https://youtu.be/_uR0ccvAaak?si=QjuK6Pnsugw0QuIw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-yellow-800 hover:underline font-medium"
            >
              Watch our video →
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}