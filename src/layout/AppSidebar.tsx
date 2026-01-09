import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  UserCircleIcon,
  UserIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { authService } from "../services/authService ";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro: boolean }[];
  roles: string[];
};

const AppSidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const location = useLocation();
  const { theme } = useTheme();
  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );

  const getDropdownMenu = (nav: NavItem): MenuProps => ({
    items: nav.subItems!.map((sub) => ({
      key: sub.path,
      label: (
        <Link to={sub.path} className="block px-3 py-1">
          {sub.name}
        </Link>
      ),
    })),
  });
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setCurrentRole(authService.getRole());
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
        icon: <UserIcon />,
        name: t("users"),
        roles: ["ROLE_SUPER_ADMIN"],
        subItems: [
          { name: t("admins"), path: "/admins", pro: false },
          { name: t("teachers"), path: "/teachers", pro: false },
          { name: t("parents"), path: "/parents", pro: false },
          { name: t("students"), path: "/students", pro: false },
        ],
      },
      {
        icon: <BoxCubeIcon />,
        name: t("classes"),
        roles: ["ROLE_SUPER_ADMIN"],
        subItems: [
          { name: t("groups"), path: "/groups", pro: false },
          { name: t("rooms"), path: "/rooms", pro: false },
        ],
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
        roles: ["ROLE_ADMIN"],
      },
      {
        icon: <UserCircleIcon />,
        name: t("students"),
        path: "/students",
        roles: ["ROLE_ADMIN", "ROLE_TEACHER"],
      },
      {
        icon: <BoltIcon />,
        name: t("grades"),
        path: "/grades",
        roles: ["ROLE_TEACHER", "ROLE_STUDENT", "ROLE_PARENT"],
      },
      {
        icon: <BoltIcon />,
        name: t("grades"),
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
        subItems: [
          { name: t("grades"), path: "/grades", pro: false },
          { name: t("assessment"), path: "/assessment", pro: false },
        ],
      },
      {
        icon: <BoxCubeIcon />,
        name: t("assessment"),
        path: "/assessment",
        roles: ["ROLE_TEACHER"],
      },
      {
        icon: <GroupIcon />,
        name: t("parents"),
        path: "/parents",
        roles: ["ROLE_ADMIN"],
      },
      {
        icon: <CheckCircleIcon />,
        name: t("attendance"),
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
        subItems: [
          { name: t("attendance"), path: "/attendance", pro: false },
          { name: t("attendanceHistory"), path: "/history-attendance", pro: false },
        ],
      },
      {
        icon: <GroupIcon />,
        name: t("groups"),
        path: "/groups",
        roles: ["ROLE_ADMIN"],
      },
      {
        icon: <BoxCubeIcon />,
        name: t("my-groups"),
        path: "/my-groups",
        roles: ["ROLE_TEACHER"],
      },
      {
        icon: <BoxIcon />,
        name: t("rooms"),
        path: "/rooms",
        roles: ["ROLE_ADMIN"],
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
    [t, i18n.language]
  );

  const filteredNavItems = allNavItems.filter(
    (item) => currentRole && item.roles.includes(currentRole)
  );

  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location.pathname]
  );

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((p) => ({
          ...p,
          [key]: subMenuRefs.current[key]!.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, type: "main" | "others") => {
    setOpenSubmenu((p) =>
      p && p.index === index && p.type === type ? null : { index, type }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            isCollapsed ? (
              <Dropdown
                menu={getDropdownMenu(nav)}
                trigger={["hover"]}
                placement="topRight"
              >
                <div
                  className={`menu-item group flex justify-center dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer ${
                    theme === "dark"
                      ? "hover:bg-green-600 text-gray-200"
                      : "menu-item-inactive"
                  }`}
                  title={nav.name}
                >
                  <span className="menu-item-icon-size">{nav.icon}</span>
                </div>
              </Dropdown>
            ) : (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group flex items-center gap-3 ${
                  openSubmenu?.index === index && openSubmenu?.type === menuType
                    ? theme === "dark"
                      ? "bg-green-700 text-white"
                      : "menu-item-active"
                    : theme === "dark"
                    ? "hover:bg-green-600 text-gray-200"
                    : "menu-item-inactive"
                }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                <span className="menu-item-text">{nav.name}</span>
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform ${
                    openSubmenu?.index === index &&
                    openSubmenu?.type === menuType
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>
            )
          ) : (
            <Link
              to={nav.path!}
              className={`menu-item  group flex items-center gap-3 ${
                isActive(nav.path!)
                  ? "menu-item-active dark:menu-item-active-dark"
                  : "menu-item-inactive dark:menu-item-inactive-dark"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <span className="menu-item-icon-size">{nav.icon}</span>
              {!isCollapsed && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
              className="overflow-hidden transition-all"
              style={{
                height:
                  openSubmenu?.index === index && openSubmenu?.type === menuType
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 ml-9 space-y-1">
                {nav.subItems.map((sub) => (
                  <li key={sub.name}>
                    <Link
                      to={sub.path}
                      className={`menu-dropdown-item  ${
                        isActive(sub.path)
                          ? "menu-dropdown-item-active dark:menu-dropdown-item-active-dark"
                          : "menu-dropdown-item-inactive dark:menu-dropdown-item-inactive-dark"
                      }`}
                    >
                      {sub.name}
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
  const roleTitleMap: Record<string, string> = {
    ROLE_SUPER_ADMIN: "Sfera Super Admin",
    ROLE_ADMIN: "Sfera Admin",
    ROLE_TEACHER: "Sfera Teacher",
    ROLE_STUDENT: "Sfera Student",
    ROLE_PARENT: "Sfera Parent",
  };
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen border-r dark:border-gray-800 border-gray-200 bg-white px-5 transition-all duration-300 dark:bg-gray-900 ${
        isExpanded || isHovered || isMobileOpen ? "w-72.5" : "w-22.5"
      } ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="py-5 flex justify-center lg:justify-start">
        <Link to={rolePathMap[currentRole]}>
          <img
            className="object-contain w-10 dark:hidden"
            src="/images/logoOne.png"
            alt="Logo"
          />
          <img
            className=" object-contain w-10 hidden dark:block"
            src="/images/logoTwo.png"
            alt="Logo Dark"
          />
        </Link>
        <h1
          className={`ml-2 text-lg mt-1.5 font-semibold text-gray-800 dark:text-white transition-all duration-300 ${
            isExpanded || isHovered || isMobileOpen
              ? "opacity-100 w-auto"
              : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          {roleTitleMap[currentRole]}
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <h2 className="mb-4 text-xs uppercase text-gray-400">
          {isExpanded || isHovered || isMobileOpen ? (
            t("menu")
          ) : (
            <HorizontaLDots />
          )}
        </h2>
        {renderMenuItems(filteredNavItems, "main")}
      </nav>
    </aside>
  );
};

export default AppSidebar;
