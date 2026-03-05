import { getBanners } from './actions'
import BannersClient from './BannersClient'

export default async function AdminBannersPage() {
  const banners = await getBanners()
  return <BannersClient initialData={banners} />
}
