import { getCurrentPlan } from '@/lib/planUtilsServer'
import { auth } from '@clerk/nextjs/server'
import { NavbarClient } from './NavbarClient'

export async function Navbar() {
  const { isAuthenticated } = await auth()
  const plan = isAuthenticated ? await getCurrentPlan() : 'free'

  return <NavbarClient initialPlan={plan} />
}
