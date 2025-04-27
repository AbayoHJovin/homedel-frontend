/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  FaBars,
  FaSignOutAlt,
  FaList,
  FaTimes,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme == "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleTabClick = (index) => {
    setTabValue(index);
    if (open) {
      setOpen(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          bgcolor: darkMode ? "grey.900" : "background.paper",
          color: darkMode ? "white" : "black",
        }}
      >
        {/* Hamburger Icon for Mobile */}
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            display: { xs: "block", md: "none" },
          }}
        >
          <FaBars />
        </IconButton>

        {/* Sidebar Drawer */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              height: "100vh",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center", // Center items vertically
              alignItems: "center", // Center items horizontally
            }}
          >
            <IconButton
              aria-label="close drawer"
              onClick={handleDrawerToggle}
              sx={{
                alignSelf: "flex-end",
                m: 1,
              }}
            >
              <FaTimes />
            </IconButton>
            <List>
              <ListItem button onClick={() => handleTabClick(0)}>
                <FaList style={{ marginRight: 8 }} />
                <ListItemText primary="Orders" />
              </ListItem>
              <ListItem button onClick={() => handleTabClick(1)}>
                <FaUser style={{ marginRight: 8 }} />
                <ListItemText primary="Personal Data" />
              </ListItem>
              <ListItem button onClick={() => handleTabClick(2)}>
                <FaLock style={{ marginRight: 8 }} />
                <ListItemText primary="Password" />
              </ListItem>
              <ListItem button onClick={() => navigate("/")}>
                <FaSignOutAlt style={{ marginRight: 8 }} />
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Sidebar for larger screens */}
          <Box
            sx={{
              width: 240,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              bgcolor: darkMode ? "grey.800" : "background.default",
              color: darkMode ? "white" : "black",
              height: "100%",
              justifyContent: "center", // Center items vertically
              alignItems: "center", // Center items horizontally
            }}
          >
            <List>
              <ListItem button onClick={() => handleTabClick(0)}>
                <FaList style={{ marginRight: 8 }} />
                <ListItemText primary="Orders" />
              </ListItem>
              <ListItem button onClick={() => handleTabClick(1)}>
                <FaUser style={{ marginRight: 8 }} />
                <ListItemText primary="Personal Data" />
              </ListItem>
              <ListItem button onClick={() => handleTabClick(2)}>
                <FaLock style={{ marginRight: 8 }} />
                <ListItemText primary="Password" />
              </ListItem>
              <ListItem button onClick={() => navigate("/")}>
                <FaSignOutAlt style={{ marginRight: 8 }} />
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </Box>

          <Box
            sx={{
              flex: 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
            }}
          >

            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
              {/* Orders Content */}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {/* Personal Data Content */}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {/* Password Content */}
            </TabPanel>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
