import React, { useEffect, useState } from "react";
import { getAllCounts } from "../api/request";
import { Col, Row, Statistic } from "antd";

const Home = () => {
  const [count, setCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllCounts();
        setCount(data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="Kişiler"
            value={count?.person}
            loading={isLoading}
          />
        </Col>
        <Col span={6}>
          <Statistic title="Olaylar" value={count?.event} loading={isLoading} />
        </Col>
        <Col span={6}>
          <Statistic
            title="Kategoriler"
            value={count?.category}
            loading={isLoading}
          />
        </Col>
        <Col span={6}>
          <Statistic title="Etiketler" value={count?.tag} loading={isLoading} />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
