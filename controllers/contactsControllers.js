import HttpError from "../helpers/HttpError.js";
import {
  addContact,
  editContact,
  getContactById,
  listContacts,
  removeContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  const { id: owner } = req.user;
  const contacts = await listContacts({ owner });
  res.send(contacts);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getContactById(id, req.user.id);
    if (!result) {
      throw HttpError(404, "Not Found");
    }

    if (result.owner.toString() !== req.user.id) {
      throw HttpError(404, "Not found");
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeContact(id, req.user.id);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    if (result.owner.toString() !== req.user.id) {
      throw HttpError(404, "Not found");
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { id: owner } = req.user;

  try {
    const result = await addContact({ ...req.body, owner });
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = await editContact(id, req.body, req.user.id);
    if (!update) {
      throw HttpError(404, "Not Found");
    }
    if (update.owner.toString() !== req.user.id) {
      throw HttpError(404, "Not found");
    }
    res.send(update);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = await editContact(id, req.body, req.user.id);
    if (!update) {
      throw HttpError(404, "Not Found");
    }
    if (update.owner.toString() !== req.user.id) {
      throw HttpError(404, "Not found");
    }
    res.send(update);
  } catch (error) {
    next(error);
  }
};
