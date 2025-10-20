import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";

interface AppLayoutProps {
  selectedCollectionId: number | null;
  onSelectCollection: (id: number | null) => void;
  onAddPrompt?: () => void;
  children: React.ReactNode;
}

export function AppLayout({
  selectedCollectionId,
  onSelectCollection,
  onAddPrompt,
  children,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={onSelectCollection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
          onAddPrompt={onAddPrompt}
          showAddPrompt={!!selectedCollectionId && !!onAddPrompt}
        />
        <main className="flex-1 overflow-y-auto p-6 gradient-bg">{children}</main>
      </div>
    </div>
  );
}
