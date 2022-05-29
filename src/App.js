import "antd/dist/antd.css";
import { BrowserRouter } from "react-router-dom";
import Container from "./components/layout/Container";
import Sidebar from "./components/navigation/Sidebar";
import { Layout } from "antd";
import { useState } from "react";
const { Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-full">
      <BrowserRouter>
        <Layout hasSider>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <Sidebar />
          </Sider>
          <Layout
            className="site-layout"
            style={{ marginLeft: collapsed ? 50 : 200 }}
          >
            <Content
              style={{
                margin: "24px 16px 0",
                overflow: "initial",
                height: "100%",
              }}
            >
              <Container />
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;

/*
*

* */
