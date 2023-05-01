import React from "react";
import { FloatButton } from "antd";
import styled from "styled-components";
import { PlusOutlined } from "@ant-design/icons";
import { highlightOrange } from "../../palette";

const StyledFloatButton = styled(FloatButton)`
  width: 60px;
  height: 60px;
  & .ant-float-btn-body {
    background: ${highlightOrange};
    transition: opacity 0.1s ease-in-out;
    opacity: 0.8;

    & .ant-float-btn-icon {
      color: #fff !important;
    }
  }

  & .ant-float-btn-body:hover {
    background: ${highlightOrange};
    opacity: 1;
  }
`;
const ActionFloatButton = ({ onAction, actionLabel }) => {
  return (
    <StyledFloatButton
      icon={<PlusOutlined />}
      tooltip={<div>{actionLabel}</div>}
      onClick={onAction}
    />
  );
};

export default ActionFloatButton;
