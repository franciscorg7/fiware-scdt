import axios from "axios";

const ngsijs = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const getEntityList = async () => {
  try {
    const response = await ngsijs.get(`/entity/list`);
    return response.data.results;
  } catch (error) {
    return [];
  }
};

const createEntity = async (entityObj) => {
  try {
    const response = await ngsijs.post(`/entity/create`, entityObj);
    return response.data.results;
  } catch (error) {
    return [];
  }
};

export default { getEntityList, createEntity };
