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

const getEntityById = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.get(`/entity/${id}`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

const createEntity = (entityObj) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.post(`/entity/create`, entityObj);
      resolve(response.data.results);
    } catch (error) {
      reject(error);
    }
  });

const ngsiJSService = { getEntityList, getEntityById, createEntity };

export default ngsiJSService;
