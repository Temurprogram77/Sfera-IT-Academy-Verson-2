import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BoltIcon,
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
  UserIcon,
  ListIcon,
  DocsIcon,
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
  subItems?: { name: string; path: string; pro: boolean; roles?: string[] }[];
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
    {},
  );

  const getDropdownMenu = (nav: NavItem): MenuProps => ({
    items: nav.subItems!.map((sub) => ({
      key: sub.path,
      label: (
        <Link
          to={sub.path}
          className={`block px-3 py-1 rounded ${
            theme === "dark"
              ? "hover:bg-[#03906d] hover:text-white text-gray-200"
              : "hover:bg-[#ecf3ff] hover:text-[#25ab61] text-gray-800"
          }`}
        >
          {sub.name}
        </Link>
      ),
    })),
    style: {
      backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
      color: theme === "dark" ? "#e5e7eb" : "#111827",
      borderColor: theme === "dark" ? "#374151" : "#d1d5db",
      paddingBlock: 4,
    },
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
        name: t("users"),
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
        subItems: [
          {
            name: t("admins"),
            path: "/admins",
            pro: false,
            roles: ["ROLE_SUPER_ADMIN"],
          },
          { name: t("teachers"), path: "/teachers", pro: false },
          { name: t("parents"), path: "/parents", pro: false },
          { name: t("students"), path: "/students", pro: false },
        ],
      },
      {
        icon: <BoxCubeIcon />,
        name: t("classes"),
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
        subItems: [
          { name: t("categories"), path: "/categories", pro: false },
          { name: t("groups"), path: "/groups", pro: false },
          { name: t("rooms"), path: "/rooms", pro: false },
        ],
      },
      {
        icon: <UserCircleIcon />,
        name: t("students"),
        path: "/students",
        roles: ["ROLE_TEACHER"],
      },
      {
        icon: <BoltIcon />,
        name: t("mygrades"),
        path: "/my-grades",
        roles: ["ROLE_STUDENT"],
      },
      {
        icon: <BoltIcon />,
        name: t("mychildsgrades"),
        path: "/my-childs-grades",
        roles: ["ROLE_PARENT"],
      },
      {
        icon: <BoltIcon />,
        name: t("grades"),
        roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEACHER"],
        subItems: [{ name: t("grades"), path: "/grades", pro: false }],
      },
      {
        name: t("attendance"),
        path: "/attendance",
        icon: <ListIcon />,
        roles: ["ROLE_TEACHER", "ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
      },
      {
        name: t("news"),
        path: "/news",
        icon: <DocsIcon />,
        roles: [
          "ROLE_TEACHER",
          "ROLE_SUPER_ADMIN",
          "ROLE_ADMIN",
          "ROLE_STUDENT",
          "ROLE_PARENT",
        ],
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
    [t, i18n.language],
  );

  const filteredNavItems = useMemo(() => {
    if (!currentRole) return [];

    return allNavItems
      .filter((item) => item.roles.includes(currentRole))
      .map((item) => {
        if (!item.subItems) return item;

        const filteredSub = item.subItems.filter(
          (sub) => !sub.roles || sub.roles.includes(currentRole),
        );

        // agar ichida hech narsa qolmasa parent ham chiqmaydi
        if (filteredSub.length === 0) return null;

        return { ...item, subItems: filteredSub };
      })
      .filter(Boolean) as NavItem[];
  }, [allNavItems, currentRole]);

  const isActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location.pathname],
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
      p && p.index === index && p.type === type ? null : { index, type },
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
                placement="bottomRight"
              >
                <div
                  className={`menu-item group flex justify-center dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer ${
                    theme === "dark"
                      ? "hover:bg-[#03906d] text-gray-200"
                      : "menu-item-inactive"
                  }`}
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
                      ? "bg-[#03906d] text-white"
                      : "menu-item-active"
                    : theme === "dark"
                      ? "menu-item-inactive dark:menu-item-inactive-dark"
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
                  ? "dark:bg-[#03906d] bg-[#ecf3ff] text-[#25ab61]  dark:text-white"
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
                          ? "menu-dropdown-item-active dark:bg-[#03906d] dark:text-white"
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
      className={`fixed top-0 left-0 z-60 h-screen border-r dark:border-gray-800 border-gray-200 bg-white px-5 transition-all duration-300 dark:bg-gray-900 ${
        isExpanded || isHovered || isMobileOpen ? "w-72.5" : "w-22.5"
      } ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="py-5 flex justify-start">
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
              ? "opacity-100 w-auto block"
              : "hidden"
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
