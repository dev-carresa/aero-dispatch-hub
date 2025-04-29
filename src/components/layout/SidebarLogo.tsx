
import { Link } from 'react-router-dom';
import { useSidebar } from './SidebarContext';

export function SidebarLogo() {
  const { expanded } = useSidebar();
  
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md bg-primary text-white flex items-center justify-center font-bold">
        T
      </div>
      {expanded && <span className="font-semibold">Transport App</span>}
    </Link>
  );
}
