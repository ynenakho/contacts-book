import axios from 'axios';
import { ContactType, ContactsResponseData } from './types';

axios.defaults.baseURL = 'https://avb-contacts-api.herokuapp.com/';

export const getContacts = (page: number, itemsPerPage: number) =>
  axios
    .get('/contacts/paginated', { params: { page, itemsPerPage } })
    .then((response) => {
      return response.data as ContactsResponseData;
    })
    .catch((err) => {
      throw Error(err.response.data.message);
    });

export const getContact = (contactId: number) =>
  axios
    .get(`/contacts/${contactId}`)
    .then((response) => {
      return response.data as ContactType;
    })
    .catch((err) => {
      throw Error(err.response.data.message);
    });

export const deleteContact = (contactId: number) =>
  axios
    .delete(`/contacts/${contactId}`)
    .then((response) => {
      return response.status === 200;
    })
    .catch((err) => {
      throw Error(err.response.data.message);
    });

export const putContact = (contactId: number, updatedContact: ContactType) =>
  axios
    .put(`/contacts/${contactId}`, updatedContact)
    .then((response) => {
      return response.data as ContactType;
    })
    .catch((err) => {
      throw Error(err.response.data.message);
    });

export const createContact = (contact: ContactType) =>
  axios
    .post(`/contacts`, contact)
    .then((response) => {
      return response.data as ContactType;
    })
    .catch((err) => {
      throw Error(err.response.data.message);
    });
