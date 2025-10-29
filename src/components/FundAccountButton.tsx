import React, { useState, useTransition } from "react";
import { useNotification } from "../hooks/useNotification.ts";
import { useWallet } from "../hooks/useWallet.ts";
import { getFriendbotUrl } from "../util/friendbot";
import { useWalletBalance } from "../hooks/useWalletBalance.ts";

const amberButtonStyle: React.CSSProperties = {
  background: "transparent",
  color: "#FFAA00",
  border: "2px solid #FFAA00",
  fontFamily: "'Courier New', monospace",
  fontSize: "0.9rem",
  fontWeight: "bold",
  letterSpacing: "2px",
  textTransform: "uppercase",
  padding: "8px 16px",
  cursor: "pointer",
  transition: "all 0.2s",
  textShadow: "0 0 5px #FFAA00",
  boxShadow: "0 0 15px rgba(255, 170, 0, 0.2)",
};

const amberButtonHoverStyle: React.CSSProperties = {
  ...amberButtonStyle,
  background: "rgba(255, 170, 0, 0.1)",
  boxShadow: "0 0 30px rgba(255, 170, 0, 0.4)",
  textShadow: "0 0 10px #FFAA00, 0 0 20px #FFAA00",
};

const FundAccountButton: React.FC = () => {
  const { addNotification } = useNotification();
  const [isPending, startTransition] = useTransition();
  const { isFunded, isLoading } = useWalletBalance();
  const [isHovering, setIsHovering] = useState(false);
  const { address } = useWallet();

  if (!address) return null;

  const handleFundAccount = () => {
    startTransition(async () => {
      try {
        const response = await fetch(getFriendbotUrl(address));

        if (response.ok) {
          addNotification("Account funded successfully!", "success");
        } else {
          const body: unknown = await response.json();
          if (
            body !== null &&
            typeof body === "object" &&
            "detail" in body &&
            typeof body.detail === "string"
          ) {
            addNotification(`Error funding account: ${body.detail}`, "error");
          } else {
            addNotification("Error funding account: Unknown error", "error");
          }
        }
      } catch {
        addNotification("Error funding account. Please try again.", "error");
      }
    });
  };

  const isDisabled = isPending || isLoading || isFunded;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleFundAccount}
      style={
        isDisabled
          ? { ...amberButtonStyle, opacity: 0.3, cursor: "not-allowed" }
          : isHovering
            ? amberButtonHoverStyle
            : amberButtonStyle
      }
      onMouseEnter={() => !isDisabled && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      title={
        isFunded
          ? "Account is already funded"
          : "Fund your account using the Stellar Friendbot"
      }
    >
      {isPending ? "Funding..." : "Fund Account"}
    </button>
  );
};

export default FundAccountButton;
