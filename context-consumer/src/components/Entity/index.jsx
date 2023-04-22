import React from "react";
import { Card } from "antd";

const Entity = ({ entity }) => {
  return (
    <Card title={entity.id} bordered={false} style={{ width: 300 }}>
      <p>Card content</p>
    </Card>
  );
};

export default Entity;
