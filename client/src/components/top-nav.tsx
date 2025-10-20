import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";

interface TopNavProps {
  onMenuClick: () => void;
  onAddPrompt?: () => void;
  showAddPrompt?: boolean;
}

export function TopNav({ onMenuClick, onAddPrompt, showAddPrompt }: TopNavProps) {
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">PromptCraft</h1>
      </div>
      <div className="flex items-center gap-2">
        {showAddPrompt && onAddPrompt && (
          <Button onClick={onAddPrompt} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Add Prompt
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

