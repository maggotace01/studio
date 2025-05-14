import { Landmark } from 'lucide-react';
import Link from 'next/link';

interface AppLogoProps {
  collapsed?: boolean;
}

export default function AppLogo({ collapsed = false }: AppLogoProps) {
  return (
    <Link href="/portfolio" className="flex items-center gap-2 px-2 py-4 text-sidebar-primary">
      <Landmark className="h-7 w-7 text-primary" />
      {!collapsed && (
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          IndoSimVest
        </h1>
      )}
    </Link>
  );
}
