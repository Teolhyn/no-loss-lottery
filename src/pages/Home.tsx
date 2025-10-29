import React from "react";
import { Layout } from "@stellar/design-system";
import { Lottery } from "../components/Lottery";

const Home: React.FC = () => (
  <Layout.Content>
    <Layout.Inset>
      <Lottery />
    </Layout.Inset>
  </Layout.Content>
);

export default Home;
