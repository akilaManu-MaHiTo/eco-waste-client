import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderIcon from "@mui/icons-material/Folder";
import { PermissionKeys } from "../../views/Administration/SectionList";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
export interface SidebarItem {
  title?: string;
  headline?: string;
  icon?: JSX.Element;
  open?: boolean;
  href?: string;
  disabled?: boolean;
  accessKey?: string;
  nestedItems?: {
    title: string;
    href: string;
    icon: JSX.Element;
    accessKey?: string;
    open?: boolean;
    disabled?: boolean;
    nestedItems?: {
      accessKey?: string;
      title: string;
      href: string;
      icon: JSX.Element;
      disabled?: boolean;
    }[];
  }[];
}

export const sidebarItems: Array<SidebarItem> = [
  {
    headline: "Home",
    accessKey: PermissionKeys.INSIGHT_VIEW,
  },
  {
    title: "Insight",
    href: "/home",
    icon: <HomeOutlinedIcon fontSize="small" />,
    accessKey: PermissionKeys.INSIGHT_VIEW,
  },
  {
    headline: "Administration",
    accessKey: PermissionKeys.ADMIN_VIEW,
  },
  {
    title: "Users",
    icon: <PersonOutlinedIcon fontSize="small" />,
    href: "/admin/users",
    accessKey: PermissionKeys.ADMIN_USERS_VIEW,
  },
  {
    title: "Access Management",
    icon: <VpnKeyOutlinedIcon fontSize="small" />,
    href: "/admin/access-management",
    accessKey: PermissionKeys.ADMIN_ACCESS_MNG_VIEW,
  },
  {
    title: "Bin Management",
    icon: <DeleteOutlinedIcon fontSize="small" />,
    href: "/admin/bin-management",
    accessKey: PermissionKeys.ADMIN_BIN_MNG_VIEW,
  },
  {
    title: "Truck Management",
    icon: <LocalShippingIcon fontSize="small" />,
    href: "/admin/truck-management",
    accessKey: PermissionKeys.ADMIN_TRUCK_MNG_VIEW,
  },
  {
    title: "Collection Requests",
    icon: <DeleteOutlinedIcon fontSize="small" />,
    href: "/admin",
    open: false,
    disabled: false,
    nestedItems: [
      {
        title: "Dashboard",
        icon: <DashboardOutlinedIcon fontSize="small" />,
        href: "/admin/collection-dashboard",
        accessKey: PermissionKeys.ADMIN_COLLECTION_MNG_DASHBOARD_VIEW,
      },
      {
        title: "Pending Requests",
        href: "/admin/waste-collection-requests",
        icon: <FolderIcon fontSize="small" />,
        accessKey: PermissionKeys.ADMIN_COLLECTION_MNG_PENDING_VIEW,
      },
      {
        title: "Approved Requests",
        href: "/admin/waste-collection-approved",
        icon: <FolderIcon fontSize="small" />,
        accessKey: PermissionKeys.ADMIN_COLLECTION_MNG_APPROVED_VIEW,
      },
    ],
  },
  {
    headline: "Waste Management",
    accessKey: PermissionKeys.WASTE_MNG_VIEW,
  },
  {
    title: "Dashboard",
    icon: <DashboardOutlinedIcon fontSize="small" />,
    href: "/waste-management/dashboard",
    accessKey: PermissionKeys.WASTE_MNG_DASHBOARD_VIEW,
  },
  {
    title: "Bin Request",
    icon: <DeleteOutlinedIcon fontSize="small" />,
    href: "/waste-management/bin-request",
    accessKey: PermissionKeys.BIN_REQUEST_VIEW,
  },
  {
    title: "Daily Waste",
    icon: <TodayOutlinedIcon fontSize="small" />,
    href: "/waste-management/today-history",
    accessKey: PermissionKeys.WASTE_MNG_HISTORY_DAILY_VIEW,
  },
  {
    title: "Waste History",
    icon: <HistoryOutlinedIcon fontSize="small" />,
    href: "/waste-management/history",
    accessKey: PermissionKeys.WASTE_MNG_HISTORY_VIEW,
  },

  {
    headline: "Waste Collection",
    accessKey: PermissionKeys.WASTE_COLLECTION_DAILY_VIEW,
  },
  {
    title: "Collector Dashboard",
    icon: <DashboardOutlinedIcon fontSize="small" />,
    href: "/waste-collection/dashboard-collection",
    accessKey: PermissionKeys.INSIGHT_VIEW,
  },
  {
    title: "Daily Collection",
    icon: <CalendarMonthIcon fontSize="small" />,
    href: "/waste-collection/daily-collection",
    accessKey: PermissionKeys.WASTE_COLLECTION_DAILY_VIEW,
  },
];
