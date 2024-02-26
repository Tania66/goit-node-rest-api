import HttpError from "../helpers/HttpError.js";
import {
  addContact,
  editContact,
  getContactById,
  listContacts,
  removeContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.send(contacts);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getContactById(id);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const result = await addContact(req.body);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = await editContact(id, req.body);
    if (!update) {
      throw HttpError(404, "Not Found");
    }
    res.send(update);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = await editContact(id, req.body);
    if (!update) {
      throw HttpError(404, "Not Found");
    }
    res.send(update);
  } catch (error) {
    next(error);
  }
};
