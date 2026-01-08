import { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;

  // 🔒 Notification lock
  isLocked: boolean;
  lockSidebar: () => void;
  unlockSidebar: () => void;

  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeSidebar: () => void;
  closeMobileSidebar: () => void;

  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // 🔒 Notification sidebar ochiqmi
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔒 Toggle’larni bloklash
  const toggleSidebar = () => {
    if (isLocked) return;
    setIsExpanded((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    if (isLocked) return;
    setIsMobileOpen((prev) => !prev);
  };

  // 🔥 Majburiy yopish
  const closeSidebar = () => setIsExpanded(false);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  // 🔒 Lock / Unlock
  const lockSidebar = () => {
    setIsLocked(true);
    setIsExpanded(false);
    setIsMobileOpen(false);
  };

  const unlockSidebar = () => {
    setIsLocked(false);
  };

  const toggleSubmenu = (item: string) => {
    if (isLocked) return;
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,

        // 🔒
        isLocked,
        lockSidebar,
        unlockSidebar,

        toggleSidebar,
        toggleMobileSidebar,
        closeSidebar,
        closeMobileSidebar,

        setIsHovered,
        setActiveItem,
        toggleSubmenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
