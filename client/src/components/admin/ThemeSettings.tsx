import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/hooks/useTheme';
import { Paintbrush } from 'lucide-react';
import { ThemeSettings as ThemeSettingsType } from '@/lib/types';

export default function ThemeSettings() {
  const { theme, updateTheme, isPending } = useTheme();
  
  const [primaryColor, setPrimaryColor] = useState(theme?.primaryColor || '#7C4DFF');
  const [secondaryColor, setSecondaryColor] = useState(theme?.secondaryColor || '#FF4081');
  const [accentColor, setAccentColor] = useState(theme?.accentColor || '#00BCD4');
  const [backgroundColor, setBackgroundColor] = useState(theme?.backgroundColor || '#121212');
  
  const [siteName] = useState('MONSTERWITH');
  const [adminEmail] = useState('sammynewlife1@gmail.com');
  const [siteDescription] = useState('Your ultimate platform for anime, manga, music, and movies.');

  const handleSaveChanges = () => {
    const settings: Omit<ThemeSettingsType, 'id' | 'isActive' | 'createdAt'> = {
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
    };
    
    updateTheme(settings);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Paintbrush className="mr-2" size={20} />
            Theme Colors
          </CardTitle>
          <CardDescription>
            Customize the appearance of the website by changing these colors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="primaryColor" className="block text-sm font-medium mb-2">Primary Color</Label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  id="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-20 rounded border-0"
                />
                <Input 
                  type="text" 
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="ml-2 w-32"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondaryColor" className="block text-sm font-medium mb-2">Secondary Color</Label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  id="secondaryColor"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-10 w-20 rounded border-0"
                />
                <Input 
                  type="text" 
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="ml-2 w-32"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="accentColor" className="block text-sm font-medium mb-2">Accent Color</Label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  id="accentColor"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-20 rounded border-0"
                />
                <Input 
                  type="text" 
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="ml-2 w-32"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="backgroundColor" className="block text-sm font-medium mb-2">Background Color</Label>
              <div className="flex items-center">
                <input 
                  type="color" 
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-20 rounded border-0"
                />
                <Input 
                  type="text" 
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="ml-2 w-32"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button 
            onClick={handleSaveChanges}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Site Information Card - For display only in this implementation */}
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>
            Basic information about the website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="block text-sm font-medium mb-2">Site Name</Label>
              <Input 
                id="siteName" 
                value={siteName}
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="adminEmail" className="block text-sm font-medium mb-2">Admin Email (Contact)</Label>
              <Input 
                id="adminEmail" 
                type="email"
                value={adminEmail}
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="siteDescription" className="block text-sm font-medium mb-2">Site Description</Label>
              <Textarea 
                id="siteDescription"
                rows={3}
                value={siteDescription}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
