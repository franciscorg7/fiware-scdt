import axios from "axios";
import { buildHistoryOptionsQueryString } from "./ngsijs-utils";

const ngsijs = axios.create({
  baseURL: process.env.REACT_APP_API_PORTO_BASE_URL,
});

const getEntityList = async (options) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.get(`/entity/list`, { params: options });
      resolve(response.data.results);
    } catch (error) {
      reject(error);
    }
  });

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

const getEntityHistory = (id, options) =>
  new Promise(async (resolve, reject) => {
    try {
      let response;
      if (options) {
        let queryString;
        try {
          queryString = buildHistoryOptionsQueryString(options);
        } catch (error) {
          reject(error);
        }
        response = await ngsijs.get(`/history/entity/${id}?${queryString}`);
      } else {
        response = await ngsijs.get(`/history/entity/${id}`);
      }
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

const getSubscriptionList = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.get(`/subscription/list`);
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
  getSubscriptionList,
};

export default ngsiJSService;
