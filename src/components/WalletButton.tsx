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
