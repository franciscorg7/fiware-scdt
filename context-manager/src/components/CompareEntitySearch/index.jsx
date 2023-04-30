import React from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import ngsiJSService from "../../services/ngsijs";

const StyledSelect = styled(Select)`
  min-width: 300px;
  height: fit-content;
`;

const CompareEntitySearch = ({ onChange, onClear, debounceTimeout = 400 }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      ngsiJSService
        .getEntityList({ idPattern: value, noDummies: true, attrs: "id" })
        .then((results) => {
          // Keep fetch callback order
          if (fetchId !== fetchRef.current) return;
          // Build select items list {label, value}
          const entityList = results.reduce((acc, entity) => {
            acc.push({ label: entity.id, value: entity.id });
            return acc;
          }, []);
          setOptions(entityList);
          setFetching(false);
        });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout]);
  return (
    <StyledSelect
      labelInValue
      size="large"
      filterOption={false}
      showSearch
      allowClear
      onChange={(selection) => onChange(selection?.value)}
      onSearch={debounceFetcher}
      onClear={() => onClear()}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      options={options}
    />
  );
};

export default CompareEntitySearch;
