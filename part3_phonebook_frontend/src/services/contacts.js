import axios from "axios";
const baseUrl = "http://localhost:3001/api/contacts";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request;
}

const update = (updatedObject) => {
  const request = axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject)
  return request.then((response) => response.data);
}

const services = { getAll, create, remove, update };

export default services;
