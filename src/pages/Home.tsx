import React from "react";
import { Layout, Text } from "@stellar/design-system";
import { Lottery } from "../components/Lottery";

const Home: React.FC = () => (
  <Layout.Content>
    <Layout.Inset>
      <Text as="h2" size="lg">
        &lt;Lottery /&gt;
      </Text>
      <Text as="p" size="md">
        Try out the No-Loss Lottery! Buy tickets, simulate yield farming, and
        run raffles. The mock UI lets you change lottery states to test
        different scenarios.
      </Text>
      <Lottery />
    </Layout.Inset>
  </Layout.Content>
);

export default Home;
