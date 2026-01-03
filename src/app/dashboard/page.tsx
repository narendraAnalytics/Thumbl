import { getUserPlanInfo } from '@/app/actions/thumbnailActions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) {
    redirect('/sign-in')
  }

  const { plan, monthlyCount } = await getUserPlanInfo()

  return <DashboardClient monthlyCount={monthlyCount} userPlan={plan} />
}
