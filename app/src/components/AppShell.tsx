interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[hsl(0_0%_6%)] text-white font-sans">
      {children}
    </div>
  );
}
