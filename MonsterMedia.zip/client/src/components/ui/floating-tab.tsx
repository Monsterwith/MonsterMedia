import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, Music, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FloatingTabProps {
  onMusicClick?: () => void;
  onSammyClick?: () => void;
}

export function FloatingTab({ onMusicClick, onSammyClick }: FloatingTabProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <Card className="p-4 bg-background/95 backdrop-blur-sm border-2 shadow-xl">
              <div className="flex items-center gap-3">
                {/* Music Option */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    onMusicClick?.();
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 h-auto py-3 px-4 min-w-[80px] hover:bg-primary/10 transition-colors"
                >
                  <Music className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Music</span>
                </Button>

                {/* Sammy AI Option */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    onSammyClick?.();
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 h-auto py-3 px-4 min-w-[80px] hover:bg-primary/10 transition-colors"
                >
                  <Bot className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">Sammy</span>
                </Button>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleOpen}
                  className="ml-2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Cabinet Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={toggleOpen}
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-200",
            "bg-primary hover:bg-primary/90 text-primary-foreground",
            "border-2 border-primary/20",
            isOpen && "rotate-12"
          )}
        >
          <Archive className="h-7 w-7" />
        </Button>
      </motion.div>
    </div>
  );
}