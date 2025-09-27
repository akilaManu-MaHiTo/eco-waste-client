import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import LayersIcon from "@mui/icons-material/Layers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import SpaIcon from "@mui/icons-material/Spa";
import ForestIcon from "@mui/icons-material/Forest";
import ScienceIcon from "@mui/icons-material/Science";
import EmergencyIcon from "@mui/icons-material/Emergency";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import FolderIcon from "@mui/icons-material/Folder";
import ConstructionIcon from "@mui/icons-material/Construction";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import DatasetLinkedOutlinedIcon from "@mui/icons-material/DatasetLinkedOutlined";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyIcon from "@mui/icons-material/Key";
import { PermissionKeys } from "../../views/Administration/SectionList";
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
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
    title: "Payment",
    href: "/payment",
    icon: <PaymentOutlinedIcon fontSize="small" />,
    accessKey: PermissionKeys.PAYMENT_VIEW,
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
    title: "Waste History",
    icon: <HistoryOutlinedIcon fontSize="small" />,
    href: "/waste-management/history",
    accessKey: PermissionKeys.WASTE_MNG_HISTORY_VIEW,
  },
];
