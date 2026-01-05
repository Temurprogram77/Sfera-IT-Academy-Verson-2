import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BoltIcon,
  BoxCubeIcon,
  BoxIcon,
  CalenderIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  UserIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { authService } from "../services/authService ";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
  roles: string[];
};

const allNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Boshqaruv paneli",
    path: "/dashboard/super_admin",
    roles: ["ROLE_SUPER_ADMIN"],
  },
  {
    icon: <GridIcon />,
    name: "Boshqaruv panelii",
    path: "/dashboard/admin",
    roles: ["ROLE_ADMIN"],
  },
  {
    icon: <UserIcon />,
    name: "O'qituvchilar",
    path: "/teachers",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
  },
  {
    icon: <UserCircleIcon />,
    name: "O'quvchilar",
    path: "/students",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
  },
  {
    icon: <BoltIcon />,
    name: "Baholar",
    path: "/grades",
    roles: ["ROLE_PARENT"],
  },
  {
    icon: <GroupIcon />,
    name: "Ota-onalar",
    path: "/parents",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
  },
  {
    icon: <CheckCircleIcon />,
    name: "Davomat",
    path: "/attendance",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
  },
  {
    icon: <GroupIcon />,
    name: "Guruhlar",
    path: "/groups",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
  },
  {
    icon: <BoxIcon />,
    name: "Xonalar",
    path: "/rooms",
    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
  },
  {
    icon: <CalenderIcon />,
    name: "Taqvim",
    path: "/calendar",
    roles: [
      "ROLE_SUPER_ADMIN",
      "ROLE_ADMIN",
      "ROLE_TEACHER",
      "ROLE_STUDENT",
      "ROLE_PARENT",
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "Shaxsiy profil",
    path: "/profile",
    roles: [
      "ROLE_SUPER_ADMIN",
      "ROLE_ADMIN",
      "ROLE_TEACHER",
      "ROLE_STUDENT",
      "ROLE_PARENT",
    ],
  },
  // UI va test sahifalari faqat SUPER_ADMIN ga
  {
    icon: <ListIcon />,
    name: "Formalar",
    subItems: [{ name: "Forma elementlari", path: "/form-elements" }],
    roles: ["ROLE_SUPER_ADMIN"],
  },
  {
    icon: <TableIcon />,
    name: "Jadvallar",
    subItems: [{ name: "Oddiy jadvallar", path: "/basic-tables" }],
    roles: ["ROLE_SUPER_ADMIN"],
  },
  {
    icon: <PageIcon />,
    name: "Sahifalar",
    subItems: [
      { name: "Bo'sh sahifa", path: "/blank" },
      { name: "404 Xato", path: "/error-404" },
    ],
    roles: ["ROLE_SUPER_ADMIN"],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Diagrammalar",
    subItems: [
      { name: "Chiziqli diagramma", path: "/line-chart" },
      { name: "Ustunli diagramma", path: "/bar-chart" },
    ],
    roles: ["ROLE_SUPER_ADMIN"],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI elementlari",
    subItems: [
      { name: "Ogohlantirishlar", path: "/alerts" },
      { name: "Avatar", path: "/avatars" },
      { name: "Belgilar", path: "/badge" },
      { name: "Tugmalar", path: "/buttons" },
      { name: "Rasmlar", path: "/images" },
      { name: "Videolar", path: "/videos" },
    ],
    roles: ["ROLE_SUPER_ADMIN"],
  },
  {
    icon: <PlugInIcon />,
    name: "Autentifikatsiya",
    subItems: [
      { name: "Kirish", path: "/signin" },
      { name: "Ro'yxatdan o'tish", path: "/signup" },
    ],
    roles: ["ROLE_SUPER_ADMIN"],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const location = useLocation();

  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const role = authService.getRole();
    setCurrentRole(role);
    console.log("Sidebar loaded with role:", role);
  }, []);

  const filteredNavItems = allNavItems.filter(
    (item) => currentRole && item.roles.includes(currentRole)
  );

  const filteredOthersItems = othersItems.filter(
    (item) => currentRole && item.roles.includes(currentRole)
  );

  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items =
        menuType === "main" ? filteredNavItems : filteredOthersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive, filteredNavItems, filteredOthersItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active dark:menu-item-active-dark"
                  : "menu-item-inactive dark:menu-item-inactive-dark"
              } cursor-pointer flex items-center gap-3 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active dark:menu-item-icon-active-dark"
                    : "menu-item-icon-inactive dark:menu-item-icon-inactive-dark"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path)
                    ? "menu-item-active dark:menu-item-active-dark"
                    : "menu-item-inactive dark:menu-item-inactive-dark"
                } cursor-pointer flex items-center gap-3 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {/* Submenu */}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active dark:menu-dropdown-item-active-dark"
                          : "menu-dropdown-item-inactive dark:menu-dropdown-item-inactive-dark"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  if (!currentRole) {
    return null;
  }

  return (
    <aside
      className={`fixed mt-16 px-3 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 h-screen transition-all ease-in-out z-50 border-r border-gray-200 dark:border-gray-700
        ${isExpanded || isHovered ? "w-[290px]" : "w-[90px]"} 
        ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
    >
      {/* Logo */}
      <div
        className={`py-5 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <img
                className="w-[60px] h-[60px] object-contain dark:hidden"
                src="/images/logoOne.png"
                alt="Logo"
              />
              <img
                className="w-[60px] h-[60px] object-contain hidden dark:block"
                src="/images/logoTwo.png"
                alt="Logo Dark"
              />
              <span className="text-[33px] leading-6 font-bold dark:text-gray-200">
                Sfera Academy
              </span>
            </div>
          ) : (
            <img src="/images/logoOne.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col overflow-y-auto ease-linear no-scrollbar dark:scrollbar-dark flex-1">
        <nav className="mb-6 flex-1">
          <div className="flex flex-col gap-8">
            {filteredNavItems.length > 0 && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Menyu"
                  ) : (
                    <HorizontaLDots className="size-6" />
                  )}
                </h2>
                {renderMenuItems(filteredNavItems, "main")}
              </div>
            )}

            {filteredOthersItems.length > 0 && (
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Boshqalar"
                  ) : (
                    <HorizontaLDots className="size-6" />
                  )}
                </h2>
                {renderMenuItems(filteredOthersItems, "others")}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
