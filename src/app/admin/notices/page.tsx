import { getNotices } from './actions'
import NoticesClient from './NoticesClient'

export default async function AdminNoticesPage() {
  const notices = await getNotices()
  return <NoticesClient initialData={notices} />
}
