import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {
  CssBaseline,
  Divider,
  Drawer,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Search, SearchIconWrapper, StyledInputBase } from "./SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";

// Interface for Appbar properties, takes in values and functions from App.tsx
interface AppbarProps {
  login: Boolean;
  window?: () => Window;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSort: (event: SelectChangeEvent) => void;
  searchValue: string;
  sortOption: string;
  sortOptions: Array<string>;
  currentRoute: string;
  searchAndSort: boolean;
}

// Sets the drawerWidth
const drawerWidth = 240;

// Navbar component
const Navbar: React.FC<AppbarProps> = ({
  login,
  window,
  handleSearch,
  handleSort,
  sortOption,
  searchValue,
  sortOptions,
  searchAndSort,
}: AppbarProps) => {
  // Configures the drawer open or close
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Allows for the drawer to be open and closed depending on screen size
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // Sets the links to be used in Navbar
  const commonLinks = [["Threads", "/threads"]];
  const navLinks = login
    ? [...commonLinks, ["Create", "/new_thread"], ["Logout", "/logout"]]
    : [...commonLinks, ["Register", "/register"], ["Log in", "/login"]];

  // Sets the forum name, currently as an icon
  const forumName = <FilterDramaIcon />;

  // Creates the drawer with search, sort, and the above links
  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {forumName}
      </Typography>
      <Divider />
      {searchAndSort && (
        <>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearch}
              value={searchValue}
            />
          </Search>
          <Divider />
          <InputLabel id="demo-simple-select-label" style={{ color: "black" }}>
            Sort by:
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortOption}
            label="Sort"
            onChange={handleSort}
            style={{ color: "black" }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Divider />{" "}
        </>
      )}
      <List>
        {navLinks.map(([item, link]) => (
          <>
            <ListItem key={item} disablePadding>
              <ListItemButton sx={{ textAlign: "center" }} href={link}>
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Box>
  );

  // Sets the container with body if defined
  const container =
    window !== undefined ? () => window().document.body : undefined;

  // The Navbar and drawer
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar component="nav" position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            {forumName}
          </Typography>
          {searchAndSort && (
            <>
              <Box
                sx={{ display: { xs: "none", sm: "block" }, marginRight: 2 }}
              >
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    onChange={handleSearch}
                    value={searchValue}
                  />
                </Search>
              </Box>
              <Box
                sx={{ display: { xs: "none", sm: "block" }, marginRight: 2 }}
              >
                <InputLabel
                  id="demo-simple-select-label"
                  style={{ color: "white" }}
                >
                  Sort by:
                </InputLabel>
              </Box>
              <Box
                sx={{ display: { xs: "none", sm: "block" }, marginRight: 2 }}
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sortOption}
                  label="Sort"
                  onChange={handleSort}
                  style={{ color: "white" }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </>
          )}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navLinks.map(([item, link]) => (
              <Button key={item} sx={{ color: "#fff" }} href={link}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
