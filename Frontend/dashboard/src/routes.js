import Dashboard from "views/Dashboard/Dashboard.js";

// import {
//   SupportIcon,
// } from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    // icon: <HomeIcon color='inherit' />,
    component: Dashboard,
    layout: "/admin",
  },
];
export default dashRoutes;
