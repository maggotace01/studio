// This file is intentionally left simple as AppShell handles the main structure.
// If specific layout adjustments for (app) group pages are needed, they can be added here.
// For now, it just passes children through.
export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
