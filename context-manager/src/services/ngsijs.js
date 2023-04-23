import axios from "axios";

const ngsijs = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const getEntityList = async () => {
  try {
    const response = await ngsijs.get(`/entity/list`);
    setTimeout(() => {}, 2000);
    return response.data.data.results;
  } catch (error) {
    return [];
  }
};

export default { getEntityList };
