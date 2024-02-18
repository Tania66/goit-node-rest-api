import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  editContact,
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
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await addContact(req.body);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getContactById(id);
    if (!result) {
      throw HttpError(404, "Not Found");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { name, email, phone } = req.body;
    const update = await editContact(
      {
        name: name || result.name,
        email: email || result.email,
        phone: phone || result.phone,
      },
      id
    );
    res.send(update);
  } catch (error) {
    next(error);
  }
};
