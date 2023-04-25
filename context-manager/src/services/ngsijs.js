import axios from "axios";

const ngsijs = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// TODO: getEntityList should return a promise (to show errors in UI)
const getEntityList = async (options) => {
  try {
    const response = await ngsijs.get(`/entity/list`, { params: options });
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

// TODO: apply filters (startDate, endDate, attrName, limit)
const getEntityHistory = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.get(`/history/entity/${id}`);
      resolve(response.data.results);
    } catch (error) {
      reject(error);
    }
  });

const getRepetitionList = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.get(`/history/repetition/list`);
      resolve(response.data.results);
    } catch (error) {
      reject(error);
    }
  });

const ngsiJSService = {
  getEntityList,
  getEntityById,
  createEntity,
  getEntityHistory,
  getRepetitionList,
};

export default ngsiJSService;
