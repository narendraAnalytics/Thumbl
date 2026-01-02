import { getMonthlyImageCount } from '@/app/actions/thumbnailActions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) {
    redirect('/sign-in')
  }

  const monthlyCount = await getMonthlyImageCount()

  return <DashboardClient monthlyCount={monthlyCount} />
}
