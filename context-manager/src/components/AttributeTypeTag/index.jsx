import React from "react";
import styled from "styled-components";
import { Row, Tag } from "antd";
import typeTagService from "../../services/type-tag";

const TagWrapper = styled(Row)`
  column-gap: 4px;
`;

const AttributeTypeTag = ({ attr, type }) => {
  return (
    <TagWrapper>
      {attr}
      <Tag bordered="false" color={typeTagService.getTypeTagColor(type)}>
        {type}
      </Tag>
    </TagWrapper>
  );
};

export default AttributeTypeTag;
