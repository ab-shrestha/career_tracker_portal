import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileSpreadsheet, CheckSquare, Building, Users, Book, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const navItems = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    path: "/applications",
    name: "Applications",
    icon: <FileSpreadsheet className="h-5 w-5" />
  },
  {
    path: "/tasks",
    name: "Tasks",
    icon: <CheckSquare className="h-5 w-5" />
  },
  {
    path: "/target-companies",
    name: "Target Companies",
    icon: <Building className="h-5 w-5" />
  },
  {
    path: "/networking",
    name: "Networking Tracker",
    icon: <Users className="h-5 w-5" />
  },
  {
    path: "/reflection-journal",
    name: "Reflection Journal",
    icon: <Book className="h-5 w-5" />
  }
];

const Sidebar = ({ isOpen, isMobile, onClose, onToggle }: SidebarProps) => {
  const location = useLocation();

  const sidebarClasses = cn(
    "bg-white border-r border-gray-200 shadow-sm transition-all duration-300",
    "flex flex-col",
    isMobile ? "fixed inset-y-0 left-0 z-40" : "relative",
    isOpen ? "w-64" : "w-[70px]"
  );

  return (
    <div className={sidebarClasses}>
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={onToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link 
          to="/" 
          className={cn(
            "text-xl font-semibold text-gray-800 transition-opacity duration-200 truncate",
            !isOpen && "opacity-0 w-0"
          )}
        >
          Career Tracker
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={isMobile ? onClose : undefined}
            className={cn(
              "flex items-center px-4 py-3 text-sm rounded-md transition-colors relative group",
              location.pathname === item.path
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center">
              {item.icon}
              <span 
                className={cn(
                  "ml-3 transition-all duration-200",
                  !isOpen && "opacity-0 w-0"
                )}
              >
                {item.name}
              </span>
            </div>

            {/* Tooltip for collapsed state */}
            {!isOpen && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                {item.name}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Mobile close button */}
      {isMobile && (
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Close Menu
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
