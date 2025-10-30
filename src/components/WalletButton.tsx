import { useState } from "react";
import { Modal } from "@stellar/design-system";
import { useWallet } from "../hooks/useWallet";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { connectWallet, disconnectWallet } from "../util/wallet";

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

export const WalletButton = () => {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [isHoveringConnect, setIsHoveringConnect] = useState(false);
  const [isHoveringDisconnect, setIsHoveringDisconnect] = useState(false);
  const [isHoveringAddress, setIsHoveringAddress] = useState(false);
  const { address, isPending } = useWallet();
  const { xlm, ...balance } = useWalletBalance();
  const buttonLabel = isPending ? "Loading..." : "[Connect Wallet]";

  if (!address) {
    return (
      <button
        type="button"
        style={isHoveringConnect ? amberButtonHoverStyle : amberButtonStyle}
        onClick={() => void connectWallet()}
        onMouseEnter={() => setIsHoveringConnect(true)}
        onMouseLeave={() => setIsHoveringConnect(false)}
      >
        {buttonLabel}
      </button>
    );
  }

  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "15px",
        opacity: balance.isLoading ? 0.6 : 1,
      }}
    >
      <style>
        {`
          /* Amber Terminal Modal Styling */
          #modalContainer [role="dialog"],
          #modalContainer [class*="Modal"],
          #modalContainer > div > div {
            background: #0A0500 !important;
            border: 2px solid #FFAA00 !important;
            box-shadow: 0 0 30px rgba(255, 170, 0, 0.3) !important;
            position: relative;
          }

          #modalContainer [role="dialog"]::before,
          #modalContainer [class*="Modal"]::before {
            content: "┌" !important;
            position: absolute !important;
            top: -2px !important;
            left: -2px !important;
            color: #FFAA00 !important;
            font-size: 1.5rem !important;
            line-height: 0 !important;
            text-shadow: 0 0 10px #FFAA00 !important;
          }

          #modalContainer [role="dialog"]::after,
          #modalContainer [class*="Modal"]::after {
            content: "┘" !important;
            position: absolute !important;
            bottom: -8px !important;
            right: -2px !important;
            color: #FFAA00 !important;
            font-size: 1.5rem !important;
            line-height: 0 !important;
            text-shadow: 0 0 10px #FFAA00 !important;
          }

          #modalContainer h1,
          #modalContainer h2,
          #modalContainer h3,
          #modalContainer h4,
          #modalContainer p,
          #modalContainer [class*="heading"] {
            color: #FFAA00 !important;
            font-family: 'Courier New', monospace !important;
            text-shadow: 0 0 5px #FFAA00 !important;
            background: transparent !important;
          }

          #modalContainer code {
            background: rgba(255, 170, 0, 0.1) !important;
            color: #FFAA00 !important;
            padding: 2px 6px !important;
            border: 1px solid #FFAA00 !important;
            border-radius: 3px !important;
            font-family: 'Courier New', monospace !important;
          }

          #modalContainer [class*="footer"] {
            background: rgba(255, 170, 0, 0.03) !important;
            border-top: 1px solid #FFAA00 !important;
          }

          #modalContainer button[class*="close"],
          #modalContainer [aria-label*="close"] {
            color: #FFAA00 !important;
            opacity: 0.7 !important;
          }

          #modalContainer button[class*="close"]:hover,
          #modalContainer [aria-label*="close"]:hover {
            opacity: 1 !important;
            text-shadow: 0 0 10px #FFAA00 !important;
          }
        `}
      </style>

      <div
        style={{
          color: "#FFAA00",
          fontFamily: "'Courier New', monospace",
          fontSize: "0.9rem",
          letterSpacing: "1px",
        }}
      >
        {xlm} XLM
      </div>

      <div id="modalContainer">
        <Modal
          visible={showDisconnectModal}
          onClose={() => setShowDisconnectModal(false)}
          parentId="modalContainer"
        >
          <Modal.Heading>
            Connected as{" "}
            <code style={{ lineBreak: "anywhere" }}>{address}</code>. Do you
            want to disconnect?
          </Modal.Heading>
          <Modal.Footer itemAlignment="stack">
            <button
              type="button"
              style={
                isHoveringDisconnect ? amberButtonHoverStyle : amberButtonStyle
              }
              onClick={() => {
                void disconnectWallet().then(() =>
                  setShowDisconnectModal(false),
                );
              }}
              onMouseEnter={() => setIsHoveringDisconnect(true)}
              onMouseLeave={() => setIsHoveringDisconnect(false)}
            >
              Disconnect
            </button>
            <button
              type="button"
              style={
                isHoveringConnect
                  ? { ...amberButtonStyle, opacity: 0.7 }
                  : { ...amberButtonStyle, opacity: 0.5 }
              }
              onClick={() => {
                setShowDisconnectModal(false);
              }}
              onMouseEnter={() => setIsHoveringConnect(true)}
              onMouseLeave={() => setIsHoveringConnect(false)}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      </div>

      <button
        type="button"
        style={
          isHoveringAddress
            ? { ...amberButtonStyle, padding: "6px 12px", fontSize: "0.85rem" }
            : {
                ...amberButtonStyle,
                padding: "6px 12px",
                fontSize: "0.85rem",
                background: "rgba(255, 170, 0, 0.05)",
              }
        }
        onClick={() => setShowDisconnectModal(true)}
        onMouseEnter={() => setIsHoveringAddress(true)}
        onMouseLeave={() => setIsHoveringAddress(false)}
        title={address}
      >
        {shortAddress}
      </button>
    </div>
  );
};
