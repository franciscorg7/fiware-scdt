import React from "react";
import styled from "styled-components";
import { Row, Tag } from "antd";
import typeTagService from "../../services/type-tag";

const TagWrapper = styled(Row)`
  column-gap: 4px;
  & .attrName {
    font-weight: 600;
  }
`;

const StyledTag = styled(Tag)`
  user-select: none;
  border: 0;
`;

const AttributeTypeTag = ({ attr, type }) => {
  return (
    <TagWrapper>
      <span className="attrName">{attr}</span>
      <StyledTag bordered="false" color={typeTagService.getTypeTagColor(type)}>
        {type}
      </StyledTag>
    </TagWrapper>
  );
};

export default AttributeTypeTag;
