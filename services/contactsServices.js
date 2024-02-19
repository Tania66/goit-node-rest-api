import fs from "fs/promises";
import path from "path";
import shortid from "shortid";
const contactsPath = path.join(process.cwd(), "./db/contacts.json");

export async function listContacts() {
  const list = await fs.readFile(contactsPath);
  return JSON.parse(list);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const getContact = contacts.find((contact) => contact.id === contactId);
  return getContact || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const remove = contacts.findIndex((item) => item.id === contactId);
  if (remove === -1) {
    return null;
  }
  const del = contacts.splice(remove, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return del;
}

export async function addContact(data) {
  const contacts = await listContacts();
  const payload = {
    ...data,
    id: shortid.generate(),
  };
  contacts.push(payload);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return payload;
}

export async function editContact(data, id) {
  const contacts = await listContacts();
  const update = contacts.findIndex((contact) => contact.id === id);
  if (update === -1) {
    return null;
  }
  contacts[update] = { ...contacts[update], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[update];
}
