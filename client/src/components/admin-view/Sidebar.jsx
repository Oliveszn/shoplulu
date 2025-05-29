import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const Menuitems = ({ setOpen }) => {
  const navigate = useNavigate();
  const adminSidebarMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      id: "products",
      label: "Products",
      path: "/admin/products",
      icon: <ShoppingBasket />,
    },
    {
      id: "thinking",
      label: "Thinking",
      path: "/admin/thinking",
      icon: <BadgeCheck />,
    },
    {
      id: "news",
      label: "News",
      path: "/admin/news",
      icon: <BadgeCheck />,
    },
    {
      id: "about",
      label: "About",
      path: "/admin/about",
      icon: <BadgeCheck />,
    },
  ];
  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen && setOpen(false);
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
};

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={20} />
          <h6 className="text-xl font-extrabold">Admin Panel</h6>
        </div>
        <Menuitems />
      </aside>
    </Fragment>
  );
};

export default AdminSidebar;
