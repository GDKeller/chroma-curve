interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-surface-base text-white font-sans">
      {children}
    </main>
  );
}
