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
