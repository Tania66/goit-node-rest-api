import { Contact } from "../models/contact.js";

export async function listContacts(owner) {
  return Contact.find(owner);
}

export async function getContactById(_id, owner) {
  return Contact.findOne({ _id, owner });
}

export async function removeContact(_id, owner) {
  return Contact.findOneAndDelete({ _id, owner });
}

export async function addContact(data) {
  return Contact.create(data);
}

export async function editContact(_id, data, owner) {
  return Contact.findOneAndUpdate({ _id, owner }, data, { new: true });
}
