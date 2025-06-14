import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Plus } from "lucide-react";
import { TopNav } from "@/components/top-nav";
import { Sidebar } from "@/components/sidebar";
import { PromptCard } from "@/components/prompt-card";
import { AddPromptModal } from "@/components/add-prompt-modal";
import { usePrompts, useReorderPrompts } from "@/hooks/use-prompts";
import { useCollections } from "@/hooks/use-collections";

export default function Home() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddPromptModal, setShowAddPromptModal] = useState(false);
  const [draggedPromptId, setDraggedPromptId] = useState<number | null>(null);
  const [promptQuery, setPromptQuery] = useState("");

  const { data: collections = [] } = useCollections();
  const { data: prompts = [] } = usePrompts(selectedCollectionId);
  const reorderPrompts = useReorderPrompts();
  const filteredPrompts = prompts.filter(p =>
    p.content.toLowerCase().includes(promptQuery.toLowerCase())
  );

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);

  const handleDragStart = (e: React.DragEvent, promptId: number) => {
    setDraggedPromptId(promptId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedPromptId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetPromptId: number) => {
    e.preventDefault();
    
    if (!draggedPromptId || !selectedCollectionId || draggedPromptId === targetPromptId) {
      return;
    }

    const draggedIndex = prompts.findIndex(p => p.id === draggedPromptId);
    const targetIndex = prompts.findIndex(p => p.id === targetPromptId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create new order
    const newPrompts = [...prompts];
    const [draggedPrompt] = newPrompts.splice(draggedIndex, 1);
    newPrompts.splice(targetIndex, 0, draggedPrompt);
    
    // Get new order of prompt IDs
    const newOrder = newPrompts.map(p => p.id);
    
    try {
      await reorderPrompts.mutateAsync({
        collectionId: selectedCollectionId,
        promptIds: newOrder,
      });
    } catch (error) {
      console.error("Failed to reorder prompts:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={setSelectedCollectionId}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
          onAddPrompt={() => setShowAddPromptModal(true)}
          showAddPrompt={!!selectedCollectionId}
        />
        <div className="border-b p-4 bg-background">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={promptQuery}
              onChange={(e) => setPromptQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {!selectedCollectionId ? (
              // No collection selected
              <div className="text-center py-16">
                <div className="text-6xl text-gray-300 mb-4">
                  <MessageSquare className="mx-auto h-16 w-16" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Welcome to PromptCraft
                </h3>
                <p className="text-gray-500 mb-6">
                  Select a collection from the sidebar to view and manage your prompts
                </p>
              </div>
            ) : prompts.length === 0 ? (
              // Empty collection
              <div className="text-center py-16">
                <div className="text-6xl text-gray-300 mb-4">
                  <MessageSquare className="mx-auto h-16 w-16" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No prompts yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start by adding your first prompt to this collection
                </p>
                <Button
                  onClick={() => setShowAddPromptModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Prompt
                </Button>
              </div>
            ) : (
              // Show prompts
              <div className="space-y-4">
                {filteredPrompts.map((prompt, index) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    index={index}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Prompt Modal */}
      {selectedCollectionId && (
        <AddPromptModal
          open={showAddPromptModal}
          onOpenChange={setShowAddPromptModal}
          collectionId={selectedCollectionId}
        />
      )}
    </div>
  );
}
