import React, { useState, useEffect } from "react";
import { Layout, Code, Card, Button, Input } from "@stellar/design-system";
import { Client } from "@stellar/stellar-sdk/contract";
import { ContractForm } from "../debug/components/ContractForm.tsx";
import { Box } from "../components/layout/Box.tsx";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useContracts } from "../debug/hooks/useContracts.ts";
import RenderContractMetadata from "../debug/components/RenderContractMetadata.tsx";

const debuggerStyles = `
  .debug-wrapper {
    min-height: 100vh;
    background: #ffffff !important;
    color: #000000 !important;
  }

  .debug-wrapper * {
    color: inherit;
  }

  .debug-wrapper h1,
  .debug-wrapper h2,
  .debug-wrapper h3,
  .debug-wrapper h4,
  .debug-wrapper h5,
  .debug-wrapper h6 {
    color: #000000 !important;
  }

  .debug-wrapper p {
    color: #000000 !important;
  }

  .debug-wrapper a {
    color: #0066cc !important;
  }

  .debug-wrapper button {
    color: inherit !important;
  }

  .debug-wrapper input,
  .debug-wrapper textarea,
  .debug-wrapper select {
    background: #ffffff !important;
    color: #000000 !important;
    border: 1px solid #cccccc !important;
  }

  .debug-wrapper hr {
    border-color: #cccccc !important;
  }

  .debug-wrapper [class*="Card"] {
    background: #f5f5f5 !important;
    border: 1px solid #dddddd !important;
  }

  .debug-wrapper [class*="Box"] {
    background: #ffffff !important;
    border: 1px solid #dddddd !important;
  }

  .debug-wrapper code {
    background: #f0f0f0 !important;
    color: #d63384 !important;
    padding: 2px 6px;
    border-radius: 3px;
  }

  .debug-wrapper pre {
    background: #f5f5f5 !important;
    border: 1px solid #dddddd !important;
    padding: 10px !important;
    border-radius: 4px;
    color: #000000 !important;
  }

  .debug-wrapper [class*="Button"] {
    border: 1px solid #cccccc !important;
  }
`;

const Debugger: React.FC = () => {
  const { data, isLoading } = useContracts();
  const contractMap = data?.loadedContracts ?? {};
  const failedContracts = data?.failed ?? {};
  const navigate = useNavigate();

  const [selectedContract, setSelectedContract] = useState<string>("");
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const { contractName } = useParams<{ contractName?: string }>();

  const contractKeys = Array.from(
    new Set([...Object.keys(contractMap), ...Object.keys(failedContracts)]),
  );
  useEffect(() => {
    if (!isLoading && contractKeys.length > 0) {
      if (contractName && contractKeys.includes(contractName)) {
        setSelectedContract(contractName);
      } else {
        setSelectedContract(contractKeys[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractName, isLoading, contractKeys.join(",")]);

  useEffect(() => {
    if (!isLoading && contractKeys.length > 0) {
      if (contractName && contractKeys.includes(contractName)) {
        setSelectedContract(contractName);
      } else if (!contractName) {
        // Redirect to the first contract if no contractName in URL
        void navigate(`/debug/${contractKeys[0]}`, { replace: true });
      } else {
        setSelectedContract(contractKeys[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractName, isLoading, contractKeys.join(",")]);

  if (isLoading) {
    return (
      <div className="debug-wrapper">
        <style>{debuggerStyles}</style>
        <Layout.Content>
          <Layout.Inset>
            <p>Loading contracts...</p>
          </Layout.Inset>
        </Layout.Content>
      </div>
    );
  }

  if (contractKeys.length === 0) {
    return (
      <div className="debug-wrapper">
        <style>{debuggerStyles}</style>
        <Layout.Content>
          <Layout.Inset>
            <p>No contracts found in src/contracts/</p>
            <p>
              Do you have any contracts defined in your root{" "}
              <Code size="sm">contracts</Code> folder, and defined in your
              environments.toml file?
            </p>
            <p>
              Use <Code size="sm">stellar scaffold generate contract</Code> to
              install contracts from the{" "}
              <a href="https://github.com/OpenZeppelin/stellar-contracts">
                OpenZeppelin Stellar Contracts
              </a>{" "}
              repository, or visit the{" "}
              <a href="https://wizard.openzeppelin.com/stellar">
                OpenZeppelin Wizard
              </a>{" "}
              to interactively build your contract.
            </p>
          </Layout.Inset>
        </Layout.Content>
      </div>
    );
  }

  return (
    <div className="debug-wrapper">
      <style>{debuggerStyles}</style>
      <Layout.Content>
        {/* Top Info Box */}
        <Layout.Inset>
          <h2>Debug Contracts</h2>
          <p>
            You can debug & interact with your deployed contracts here. Check{" "}
            <Code size="md">src/contracts/*.ts</Code>
          </p>
          <hr />
        </Layout.Inset>

        {/* Contract Selector Pills */}
        <Layout.Inset>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1rem",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            {contractKeys.map((key) => (
              <NavLink
                key={key}
                to={`/debug/${key}`}
                style={{
                  textDecoration: "none",
                }}
              >
                {({ isActive }) => (
                  <Button variant={isActive ? "primary" : "tertiary"} size="sm">
                    {key}
                  </Button>
                )}
              </NavLink>
            ))}
          </div>
        </Layout.Inset>

        {/* Show error or contract details */}
        {(!selectedContract ||
          (!contractMap[selectedContract] &&
            !failedContracts[selectedContract])) && (
          <Layout.Inset>
            <p>No contract selected or contract not found.</p>
          </Layout.Inset>
        )}

        {failedContracts[selectedContract] && (
          <Layout.Inset>
            <h2>{selectedContract}</h2>
            <p style={{ color: "red" }}>
              Failed to import contract: {failedContracts[selectedContract]}
            </p>
          </Layout.Inset>
        )}

        {contractMap[selectedContract] && (
          <>
            <Layout.Inset>
              <div style={{ marginTop: "0 2rem" }}>
                <div
                  style={{ display: "flex", flexFlow: "column", gap: "1rem" }}
                >
                  {/* Contract detail card */}
                  <div
                    style={{
                      flexBasis: "30%",
                      minWidth: "100%",
                      alignSelf: "flex-start",
                    }}
                  >
                    <Card variant="primary">
                      <Box gap="md">
                        <h3>{selectedContract}</h3>

                        <Input
                          label="Contract ID"
                          id="contract-id"
                          fieldSize="md"
                          copyButton={{
                            position: "right",
                          }}
                          readOnly
                          value={
                            (
                              contractMap[selectedContract]
                                ?.default as unknown as Client
                            )?.options?.contractId || ""
                          }
                        />

                        {isDetailExpanded && (
                          <>
                            <RenderContractMetadata
                              metadata={contractMap[selectedContract]?.metadata}
                            />
                          </>
                        )}
                      </Box>
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                        style={{ justifySelf: "flex-end", marginTop: "1rem" }}
                      >
                        {isDetailExpanded ? "Hide Details" : "Show Details"}
                      </Button>
                    </Card>
                  </div>

                  {/* Contract methods and interactions */}
                  <div style={{ flex: 1 }}>
                    <ContractForm
                      key={selectedContract}
                      contractClient={contractMap[selectedContract]?.default}
                      contractClientError={null}
                    />
                  </div>
                </div>
              </div>
            </Layout.Inset>{" "}
          </>
        )}
      </Layout.Content>
    </div>
  );
};

export default Debugger;
