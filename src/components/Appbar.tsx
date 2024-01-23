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

interface AppbarProps {
  login: Boolean;
  window?: () => Window;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSort: (event: SelectChangeEvent) => void;
  searchValue: string;
  sortOption: string;
  sortOptions: Array<string>;
  currentRoute: string;
}

const drawerWidth = 240;

const Navbar: React.FC<AppbarProps> = ({
  login,
  window,
  handleSearch,
  handleSort,
  sortOption,
  searchValue,
  sortOptions,
  currentRoute,
}: AppbarProps) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  //Yet to implement rating for comments
  if (currentRoute.includes("/thread/")) {
    sortOptions.splice(2);
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const commonLinks = [["Threads", "/threads"]];

  const navLinks = login
    ? [...commonLinks, ["Create", "/new_thread"], ["Logout", "/logout"]]
    : [...commonLinks, ["Register", "/register"], ["Log in", "/login"]];

  const forumName = "Forum";

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {forumName}
      </Typography>
      <Divider />
      <List>
        {navLinks.map(([item, link]) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} href={link}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
          <InputLabel id="demo-simple-select-label" style={{ color: "white" }}>
            Sort by:
          </InputLabel>
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
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navLinks.map(([item, link]) => (
              <Button key={item} sx={{ color: "#fff" }} href={link}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
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
      </nav>
    </Box>
  );
};

export default Navbar;
