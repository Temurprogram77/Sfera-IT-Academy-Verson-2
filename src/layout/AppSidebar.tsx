import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BoltIcon,
  BoxIcon,
  CalenderIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  UserCircleIcon,
  UserIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { authService } from "../services/authService "; // bo'sh joy olib tashlandi
import { useTranslation } from "react-i18next";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
  roles: string[];
};

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
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

  const allNavItems = useMemo<NavItem[]>(
    () => [
      {
        icon: <GridIcon />,
        name: t("dashboard_super_admin"),
        path: "/dashboard/super_admin",
        roles: ["ROLE_SUPER_ADMIN"],
      },
      {
        icon: <GridIcon />,
        name: t("dashboard_student"),
        path: "/dashboard/student",
        roles: ["ROLE_STUDENT"],
      },
      {
        icon: <GridIcon />,
        name: t("dashboard_admin"),
        path: "/dashboard/admin",
        roles: ["ROLE_ADMIN"],
      },
      {
        icon: <GridIcon />,
        name: t("dashboard_teacher"),
        path: "/dashboard/teacher",
        roles: ["ROLE_TEACHER"],
      },
      {
        icon: <GridIcon />,
        name: t("dashboard_parent"),
        path: "/dashboard/parent",
        roles: ["ROLE_PARENT"],
      },
      {
        icon: <UserIcon />,
        name: t("teachers"),
        path: "/teachers",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
      },
      {
        icon: <UserCircleIcon />,
        name: t("students"),
        path: "/students",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
      },
      {
        icon: <BoltIcon />,
        name: t("grades"),
        path: "/grades",
        roles: [
          "ROLE_SUPER_ADMIN",
          "ROLE_ADMIN",
          "ROLE_TEACHER",
          "ROLE_STUDENT",
          "ROLE_PARENT",
        ],
      },
      {
        icon: <GroupIcon />,
        name: t("parents"),
        path: "/parents",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
      },
      {
        icon: <CheckCircleIcon />,
        name: t("attendance"),
        path: "/attendance",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
      },
      {
        icon: <GroupIcon />,
        name: t("groups"),
        path: "/groups",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
      },
      {
        icon: <BoxIcon />,
        name: t("rooms"),
        path: "/rooms",
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
      },
      {
        icon: <CalenderIcon />,
        name: t("calendar"),
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
        name: t("profile"),
        path: "/profile",
        roles: [
          "ROLE_SUPER_ADMIN",
          "ROLE_ADMIN",
          "ROLE_TEACHER",
          "ROLE_STUDENT",
          "ROLE_PARENT",
        ],
      },
    ],
    [t]
  );

  const filteredNavItems = allNavItems.filter(
    (item) => currentRole && item.roles.includes(currentRole)
  );

  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location.pathname]
  );

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
                !isExpanded && !isHovered && !isMobileOpen
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span className="menu-item-icon-size">{nav.icon}</span>
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
            <Link
              to={nav.path!}
              className={`menu-item group ${
                isActive(nav.path!)
                  ? "menu-item-active dark:menu-item-active-dark"
                  : "menu-item-inactive dark:menu-item-inactive-dark"
              } cursor-pointer flex items-center gap-3 ${
                !isExpanded && !isHovered && !isMobileOpen
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span className="menu-item-icon-size">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}

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

  if (!currentRole) return null;

  const rolePathMap: Record<string, string> = {
    ROLE_ADMIN: "/dashboard/admin",
    ROLE_SUPER_ADMIN: "/dashboard/super_admin",
    ROLE_TEACHER: "/dashboard/teacher",
    ROLE_STUDENT: "/dashboard/student",
    ROLE_PARENT: "/dashboard/parent",
  };
  const homePath = rolePathMap[currentRole || ""] || "/";

  return (
   <aside
      className={`fixed md:mt-16 m-0 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      {/* Logo */}
      <div
        className={`py-5 flex ${
          !isExpanded && !isHovered && !isMobileOpen
            ? "lg:justify-center"
            : "justify-start"
        }`}
      >
        <Link to={homePath}>
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
                Sfera{" "}
                {currentRole === "ROLE_STUDENT"
                  ? "Student"
                  : currentRole === "ROLE_ADMIN"
                  ? "Admin"
                  : currentRole === "ROLE_PARENT"
                  ? "Parent"
                  : currentRole === "ROLE_TEACHER"
                  ? "Teacher"
                  : currentRole === "ROLE_SUPER_ADMIN"
                  ? "Super Admin"
                  : ""}
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
                    !isExpanded && !isHovered && !isMobileOpen
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    t("menu")
                  ) : (
                    <HorizontaLDots className="size-6" />
                  )}
                </h2>
                {renderMenuItems(filteredNavItems, "main")}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
