import { MuseumAPI } from ".";

/**
 *
 * Person
 *
 */

export const addPerson = (data) => MuseumAPI.post("/persons", data);

export const getAllPerson = () => MuseumAPI.get("/persons");

export const deletePerson = (id) => MuseumAPI.delete(`/persons/${id}`);

export const updatePerson = (id, data) =>
  MuseumAPI.patch(`/persons/${id}`, data);

export const findById = (id) => MuseumAPI.get(`/persons/${id}`);

/**
 *
 * Event
 *
 */

export const getEventsByPersonId = (id) =>
  MuseumAPI.get(`/events/persons/${id}`);

export const addEvent = (data) => MuseumAPI.post("/events", data);

export const deleteEvent = (id) => MuseumAPI.delete(`/events/${id}`);

export const getOneEvent = (id) => MuseumAPI.get(`/events/${id}`);

export const updateEvent = (id, data) => MuseumAPI.patch(`/events/${id}`, data);

/**
 *
 * Categories
 *
 */

export const getAllCategories = () => MuseumAPI.get("/categories");

export const deleteCategory = (id) => MuseumAPI.delete(`/categories/${id}`);

export const addCategory = (data) => MuseumAPI.post(`/categories`, data);

export const getOneCategory = (id) => MuseumAPI.get(`/categories/${id}`);

export const updateCategory = (id, data) =>
  MuseumAPI.patch(`/categories/${id}`, data);

/**
 *
 * Tags
 *
 */

export const getAllTags = () => MuseumAPI.get("/tags");

export const addTag = (data) => MuseumAPI.post("/tags", data);

export const getOneTag = (id) => MuseumAPI.get(`/tags/${id}`);

export const updateTag = (id, data) => MuseumAPI.patch(`/tags/${id}`, data);

export const deleteTag = (id) => MuseumAPI.delete(`/tags/${id}`);
