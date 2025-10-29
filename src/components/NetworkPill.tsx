import React from "react";
import { useWallet } from "../hooks/useWallet";
import { stellarNetwork } from "../contracts/util";

// Format network name with first letter capitalized
const formatNetworkName = (name: string) =>
  // TODO: This is a workaround until @creit-tech/stellar-wallets-kit uses the new name for a local network.
  name === "STANDALONE"
    ? "Local"
    : name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

const appNetwork = formatNetworkName(stellarNetwork);

const NetworkPill: React.FC = () => {
  const { network, address } = useWallet();

  // Check if there's a network mismatch
  const walletNetwork = formatNetworkName(network ?? "");
  const isNetworkMismatch = walletNetwork !== appNetwork;

  let title = "";
  let indicatorColor = "#FFAA00";
  if (!address) {
    title = "Connect your wallet using this network.";
    indicatorColor = "#666";
  } else if (isNetworkMismatch) {
    title = `Wallet is on ${walletNetwork}, connect to ${appNetwork} instead.`;
    indicatorColor = "#FF3B30";
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(255, 170, 0, 0.1)",
        color: "#FFAA00",
        padding: "6px 12px",
        border: "2px solid #FFAA00",
        fontSize: "0.9rem",
        fontFamily: "'Courier New', monospace",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: isNetworkMismatch ? "help" : "default",
        letterSpacing: "1px",
        textTransform: "uppercase",
        textShadow: "0 0 5px #FFAA00",
      }}
      title={title}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: indicatorColor,
          boxShadow: `0 0 8px ${indicatorColor}`,
        }}
      />
      {appNetwork}
    </div>
  );
};

export default NetworkPill;
