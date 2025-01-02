import * as React from "react";
import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
//import StickyFooter from "./components/StickyFooter";
import { router } from "./router";
//import { themeOptions } from "./themeOptions";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useThemeStore } from "./store/themeStore";
import solServices from "./utils/services";

import { AppContext } from "./pages/context/AppContext";
declare global {
  interface Window {
    ethereum: any;
  }
}
export default function App() {
  const { theme } = useThemeStore();

  const [accountAddress, setAccountAddress] = useState<any>();
  // console.log("accountAddress: " , accountAddress)
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const initialize = async () => {
      const account = await solServices.handleConnect();
      if (account) {
        setAccountAddress(account);
        const role =  await solServices.loadWeb3(account, setContract);
        console.log(role)
        if (role && window.location.pathname === "/") {
          window.location.href = "/profile";
        } 
        
     
      }
    };

    initialize();

    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: any) => {
        console.log("check ")
        if (accounts.length > 0) {
          setAccountAddress(accounts[0]);
          const role = await solServices.loadWeb3(accounts[0], setContract);
          // console.log("check ", role)
          // if (role && window.location.pathname === "/") {
          //   window.location.href = "/profile";
          // } 
          // if (!role) {       
          //   window.location.href = "/";
          // }

          window.location.reload()
      
        } else {
          setAccountAddress("");
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <AppContext.Provider value={{ contract, accountAddress }}>
        <CssBaseline />
        <React.Suspense
          fallback={
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          }
        >
          <RouterProvider router={router} />
          {/* <StickyFooter /> */}
        </React.Suspense>
      </AppContext.Provider>
    </ThemeProvider>
  );
}
