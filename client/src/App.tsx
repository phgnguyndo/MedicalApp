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
import { Button } from "@mui/material";

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
        solServices.loadWeb3(account, setContract);
      }
    };

    initialize();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: any) => {
        if (accounts.length > 0) {
          setAccountAddress(accounts[0]);
          solServices.loadWeb3(accounts[0], setContract);
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

  const hanleTest = async () => {
    try {
      console.log(contract);
      console.log(accountAddress);
      const name = "name2";
      const age = 10;
      const gender = "name2";
      const bloodType = "name2";
      const allergies = "name2";
      const diagnosis = "name2";
      const treatment = "name2";
      const imageHash = "name2";

      await contract.methods
        .addRecord(
          name,
          age,
          gender,
          bloodType,
          allergies,
          diagnosis,
          treatment,
          imageHash
        )
        .send({ from: accountAddress, gas: 3000000 });
    } catch (err) {
      console.log(err);
    }
  };

  const viewRecord = async () => {
    const recordId = 2;
    if (recordId && accountAddress) {
      try {
        const res = await contract.methods
          .getRecord(accountAddress, recordId)
          .call();
        const recordJson = {
          timestamp: res[0],
          name: res[1],
          age: res[2],
          gender: res[3],
          bloodType: res[4],
          allergies: res[5],
          diagnosis: res[6],
          treatment: res[7],
          imageHash: res[8],
        };
        console.log("reacord", recordJson);
      } catch (error) {
        console.error("Error fetching record:", error);
      }
    } else {
      alert("Please provide a valid record ID.");
    }
  };

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
