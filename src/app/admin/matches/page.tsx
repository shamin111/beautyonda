import { getMatchRequests } from './actions'
import MatchesClient from './MatchesClient'

export default async function AdminMatchesPage() {
  const matches = await getMatchRequests()
  return <MatchesClient initialData={matches} />
}
