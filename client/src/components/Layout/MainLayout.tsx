import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Alert,
  Badge,
  Button,
  Collapse,
  Drawer as MobileDrawer,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router";
import { SidebarItem, sidebarItems } from "./SidebarItems";
import theme from "../../theme";
import useIsMobile from "../../customHooks/useIsMobile";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { PermissionKeysObject } from "../../views/Administration/SectionList";
import useCurrentUser from "../../hooks/useCurrentUser";
import "./MainLayout.css";
import ViewUserContent from "../../views/Administration/ViewUserProfileContent";
import ViewProfileDataDrawer, {
  DrawerProfileHeader,
} from "../ViewProfileDataDrawer";
import ProfileImage from "../ProfileImageComponent";
import { useQuery } from "@tanstack/react-query";
// import { getOrganization } from "../../api/OrganizationSettings/organizationSettingsApi";
import Logo from "../../assets/eco waste logo.png";
const drawerWidth = 265;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
  [theme.breakpoints.down("md")]: {
    width: "100%", // Ensure full width on mobile
    marginLeft: 0, // Reset margin on mobile
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

interface Props {
  children: JSX.Element | JSX.Element[];
}

export default function MainLayout({ children }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(isMobile ? false : true);
  const { user } = useCurrentUser();
  const [openViewProfileDrawer, setOpenViewProfileDrawer] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [openEditUserRoleDialog, setOpenEditUserRoleDialog] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const { data: organizationData } = useQuery({
  //   queryKey: ["organization"],
  //   queryFn: getOrganization,
  // });

  // console.log("yoo", organizationData?.logoUrl);
  // const logoUrl = useMemo(() => {
  //   if (organizationData && organizationData?.logoUrl) {
  //     return Array.isArray(organizationData.logoUrl)
  //       ? organizationData.logoUrl[0]
  //       : organizationData.logoUrl;
  //   }
  // }, [organizationData]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "#fff",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                aria-label="open drawer"
                onClick={toggleDrawerOpen}
                edge="start"
                sx={[
                  {
                    color: "#024271",
                    marginRight: 3,
                  },
                  open && !isMobile && { display: "none" },
                ]}
              >
                <MenuIcon />
              </IconButton>
              {Logo && (
                <Box>
                  <img
                    src={Logo}
                    alt="logo"
                    height={"45rem"}
                    style={{ marginTop: "10px" }}
                  />
                </Box>
              )}
            </Box>
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography
                  variant="subtitle1"
                  noWrap
                  component="div"
                  sx={{
                    color: "var(--eco-waste-primary-green)",
                    display: "flex",
                    marginRight: "0.5rem",
                  }}
                >
                  Monitor and Manage
                </Typography>
                <Typography
                  variant="subtitle1"
                  noWrap
                  component="div"
                  sx={{ color: "#000", display: "flex" }}
                >
                  <span className="slider-text" style={{ fontWeight: 600 }}>
                    Environment
                  </span>
                  <span className="slider-text" style={{ fontWeight: 600 }}>
                    Recycling
                  </span>
                  <span className="slider-text" style={{ fontWeight: 600 }}>
                    Smart Cities
                  </span>
                </Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* {!isMobile && (
                <>
                  <IconButton
                    size="small"
                    sx={[
                      {
                        color: "#024271",
                        marginRight: "12px",
                      },
                    ]}
                  >
                    <GridViewIcon sx={{ fontSize: "1.6rem" }} />
                  </IconButton>

                  <IconButton
                    size="small"
                    sx={[
                      {
                        color: "#024271",
                        marginRight: "14px",
                      },
                    ]}
                  >
                    <Badge variant="dot" color="success">
                      <MailOutlineIcon sx={{ fontSize: "1.6rem" }} />
                    </Badge>
                  </IconButton>
                </>
              )} */}
              {/* <Avatar
                sx={{
                  bgcolor: "var(--pallet-orange)",
                  height: "2rem",
                  width: "2rem",
                  cursor: "pointer",
                }}
                onClick={() => setOpenViewProfileDrawer(true)}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar> */}

              <ProfileImage
                name={user?.username}
                files={user?.profileImage}
                size="2rem"
                onClick={() => setOpenViewProfileDrawer(true)}
              />
              <ViewProfileDataDrawer
                open={openViewProfileDrawer}
                handleClose={() => setOpenViewProfileDrawer(false)}
                fullScreen={true}
                drawerContent={
                  <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
                    <DrawerProfileHeader
                      title="User Profile"
                      handleClose={() => setOpenViewProfileDrawer(false)}
                      onEdit={() => {
                        setOpenEditUserRoleDialog(true);
                      }}
                    />
                    <Stack>
                      <ViewUserContent selectedUser={user} />
                    </Stack>
                  </Stack>
                }
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <MobileDrawer
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          PaperProps={{
            sx: {
              backgroundColor: "#010f24",
              color: "#fff",
              elevation: 2,
            },
          }}
        >
          <DrawerContent handleDrawerClose={handleDrawerClose} />
        </MobileDrawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          PaperProps={{
            sx: {
              backgroundColor: "#010f24",
              color: "#fff",
              elevation: 2,
            },
          }}
        >
          <DrawerContent handleDrawerClose={handleDrawerClose} />
        </Drawer>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

const DrawerContent = ({
  handleDrawerClose,
}: {
  handleDrawerClose: () => void;
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { user } = useCurrentUser();

  const userPermissionObject = useMemo(() => {
    if (user && user?.permissionObject) {
      return user.permissionObject;
    }
  }, [user]);
  console.log(userPermissionObject);
  return (
    <>
      <DrawerHeader sx={{ justifyContent: "flex-start" }}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon
              sx={{
                color: "#fff",
              }}
            />
          ) : (
            <ChevronLeftIcon
              sx={{
                color: "#fff",
              }}
            />
          )}
        </IconButton>
        <Typography
          variant="subtitle1"
          noWrap
          component="div"
          sx={{ color: "#7db0ff" }}
        >
          Hello, Welcome!
        </Typography>
      </DrawerHeader>
      <Divider sx={{ marginBottom: "1rem", backgroundColor: "#7db0ff" }} />
      <Box
        sx={{
          height: "calc(100vh - 75px)",
          overflowY: "auto",
          paddingLeft: 0,
          overflowX: "hidden",
        }}
      >
        {sidebarItems.map((item, i) => {
          if (item?.accessKey && !userPermissionObject[`${item?.accessKey}`])
            return null;

          if (
            item?.headline &&
            item?.accessKey &&
            userPermissionObject[`${item?.accessKey}`]
          ) {
            return (
              <Typography
                key={item.headline}
                variant="body2"
                sx={{
                  color: "#7db0ff",
                  padding: "0.5rem 1rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginTop: "0.5rem",
                }}
              >
                {item.headline}
              </Typography>
            );
          }

          if (item.nestedItems) {
            return (
              <Box
                sx={{ marginLeft: "1rem" }}
                key={`${item.href} +${item.title}`}
              >
                <NestedItem
                  item={item}
                  handleDrawerClose={handleDrawerClose}
                  userPermissionObject={userPermissionObject}
                />
              </Box>
            );
          }
          return (
            <ListItem
              key={item.accessKey}
              disableGutters
              sx={{ paddingY: "3px", marginLeft: "1rem" }}
            >
              <LinkButton
                to={item.href}
                icon={item.icon}
                title={item.title}
                disabled={item.disabled}
                handleDrawerClose={handleDrawerClose}
              />
            </ListItem>
          );
        })}

        <Divider
          sx={{ backgroundColor: "var(--pallet-grey)", marginTop: "1rem" }}
        />
        <Button
          sx={{
            textTransform: "capitalize",
            marginLeft: "1rem",
            marginY: "1rem",
            color: "var(--pallet-orange)",
            width: "90%",
            justifyContent: "flex-start",
            paddingLeft: "1rem",
            borderRadius: "0.5rem",
          }}
          startIcon={<LogoutIcon />}
          onClick={() => setLogoutDialogOpen(true)}
        >
          Log Out
        </Button>
      </Box>

      {logoutDialogOpen && (
        <DeleteConfirmationModal
          open={logoutDialogOpen}
          title="Log Out Confirmation"
          customDeleteButtonText="Log Out Now"
          customDeleteButtonIon={<LogoutIcon />}
          content={
            <>
              Are you sure you want to log out of the application?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                You will be logged out of the application and will need to log
                in with credentials again to access your account.
              </Alert>
            </>
          }
          handleClose={() => setLogoutDialogOpen(false)}
          deleteFunc={async () => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          onSuccess={() => {
            setLogoutDialogOpen(false);
            enqueueSnackbar("Logged Out Successfully!", {
              variant: "success",
            });
          }}
          handleReject={() => {
            setLogoutDialogOpen(false);
          }}
        />
      )}
    </>
  );
};

const NestedItem = React.memo(
  ({
    item,
    handleDrawerClose,
    userPermissionObject,
  }: {
    item: SidebarItem;
    handleDrawerClose: () => void;
    userPermissionObject: PermissionKeysObject;
  }) => {
    const [open, setOpen] = React.useState(item.open);
    const isAllItemsHidden = useMemo(() => {
      const checkNestedItems = (nestedItems: SidebarItem[]) => {
        return nestedItems.every((nestedItem) => {
          if (nestedItem.nestedItems) {
            return checkNestedItems(nestedItem.nestedItems);
          }
          return (
            nestedItem?.accessKey && !userPermissionObject[nestedItem.accessKey]
          );
        });
      };

      return checkNestedItems(item.nestedItems);
    }, [item.nestedItems, userPermissionObject]);

    if (isAllItemsHidden) return null;

    return (
      <React.Fragment key={item.accessKey}>
        <Button
          onClick={() => setOpen((o) => !o)}
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            fontSize: "0.8rem",
            paddingY: "0.2rem",
            alignItems: "center",
            marginY: "0.1rem",
          }}
          disabled={item.disabled}
        >
          <div
            style={{
              marginRight: "0.5rem",
              marginBottom: -4,
              color: item.disabled ? "grey" : "#fff",
            }}
          >
            {item.icon}
          </div>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              color: item.disabled ? "grey" : "#fff",
            }}
          >
            {item.title}
          </Typography>
        </Button>
        <Collapse in={open} unmountOnExit>
          <List>
            {item.nestedItems.map((item) => {
              if (
                item?.accessKey &&
                !userPermissionObject[`${item?.accessKey}`]
              )
                return null;

              if (item.nestedItems) {
                return (
                  <Box key={item.accessKey} sx={{ marginLeft: "0.5rem" }}>
                    <NestedItem
                      item={item}
                      handleDrawerClose={handleDrawerClose}
                      userPermissionObject={userPermissionObject}
                    />
                  </Box>
                );
              }

              return (
                <ListItem
                  disableGutters
                  key={item.accessKey}
                  sx={{ paddingY: "3px", marginLeft: "0.5rem" }}
                >
                  <LinkButton
                    to={item.href}
                    icon={item.icon}
                    title={item.title}
                    disabled={item.disabled}
                    handleDrawerClose={handleDrawerClose}
                  />
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </React.Fragment>
    );
  }
);

interface LinkButtonProps {
  to: string;
  icon: any;
  title: string;
  disabled?: boolean;
  handleDrawerClose: () => void;
}

export const LinkButton = React.memo(
  ({ to, icon, title, disabled, handleDrawerClose }: LinkButtonProps) => {
    const { pathname } = useLocation();
    const { isTablet } = useIsMobile();

    const isMatch = to === "/" ? pathname === to : pathname.startsWith(to);

    return (
      <Link
        to={to}
        style={{ width: 220 }}
        onClick={() => {
          if (isTablet) handleDrawerClose();
        }}
      >
        <Button
          sx={{
            fontSize: "0.8rem",
            paddingY: "0.2rem",
            alignItems: "center",
            borderLeft: isMatch ? "4px solid var(--pallet-orange)" : "none",
          }}
          disabled={disabled}
        >
          <div
            style={{
              marginRight: "0.4rem",
              marginBottom: -5,
              color: disabled
                ? "grey"
                : isMatch
                ? "var(--pallet-orange)"
                : "#fff",
            }}
          >
            {icon}
          </div>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              color: disabled
                ? "grey"
                : isMatch
                ? "var(--pallet-orange)"
                : "#fff",
            }}
          >
            {title}
          </Typography>
        </Button>
      </Link>
    );
  }
);
