import { Contact } from "../models/contact.js";

export async function listContacts() {
  return Contact.find();
}

export async function getContactById(contactId) {
  return Contact.findById(contactId);
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId);
}

export async function addContact(data) {
  return Contact.create(data);
}

export async function editContact(contactId, data) {
  return Contact.findByIdAndUpdate(contactId, data, { new: true });
}
