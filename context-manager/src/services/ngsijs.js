import axios from "axios";
import { buildHistoryOptionsQueryString } from "./ngsijs-utils";

const ngsijs = axios.create({
  baseURL: process.env.REACT_APP_API_PORTO_BASE_URL,
});

/**
 * Get the entity list
 */
const getEntityList = async (options) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.get(`/entity/list`, { params: options });
      resolve(response.data.results);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Get an entity by its identifier
 */
const getEntityById = async (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.get(`/entity/${id}`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Create a new entity
 */
const createEntity = (entityObj) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.post(`/entity/create`, entityObj);
      resolve(response.data.results);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Get entity history (w/ filter options)
 */
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

/**
 * Get the list of all repetitions
 */
const getRepetitionList = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.get(`/history/repetition/list`);
      resolve(response.data.results);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Start a new repetition from given object
 */
const startRepetition = (newRepetitionObj) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await ngsijs.post(
        `/history/repetition`,
        newRepetitionObj
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });

/**
 * Get the list of all subscriptions
 */
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
  startRepetition,
};

export default ngsiJSService;
