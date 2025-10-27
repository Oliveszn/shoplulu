import { Box, Tab, Tabs, Card, Button } from "@mui/material";
import { useState } from "react";
import Address from "../components/address/Address";
import Orders from "../components/orders/orders";
import { MapPin, Package, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";
import { HeadProvider, Title, Meta } from "react-head";
const UserAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = ({ children, value, index }) => {
    return value === index ? <Box sx={{ p: 2 }}>{children}</Box> : null;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/", { replace: true });
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <HeadProvider>
        <Title>Account</Title>
        <Meta name="description" content="Luxury fashion at Shoplulu" />
      </HeadProvider>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4"></div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              className="px-6"
              sx={{
                "& .MuiTab-root": {
                  minHeight: "64px",
                  fontSize: "16px",
                  fontWeight: 500,
                },
              }}
            >
              <Tab
                icon={<Package size={20} />}
                iconPosition="start"
                label="My Orders"
                className="flex items-center space-x-2"
              />
              <Tab
                icon={<MapPin size={20} />}
                iconPosition="start"
                label="Addresses"
                className="flex items-center space-x-2"
              />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <Orders />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Address selectedId={null} setCurrentSelectedAddress={() => {}} />
          </TabPanel>
        </Card>
      </div>
    </div>
  );
};

export default UserAccount;
