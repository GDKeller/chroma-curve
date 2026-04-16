interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="bg-surface-base min-h-screen font-sans text-white">
      {children}
    </main>
  );
}
