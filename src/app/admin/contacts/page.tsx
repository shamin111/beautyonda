import { getContacts } from './actions'
import ContactsClient from './ContactsClient'

export default async function AdminContactsPage() {
  const contacts = await getContacts()
  return <ContactsClient initialData={contacts} />
}
