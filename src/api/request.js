import { MuseumAPI } from ".";

/**
 *
 * Person
 *
 */

export const addPerson = (data) => MuseumAPI.post("/person", data);
