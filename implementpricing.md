# Thumbl Pricing & Billing Implementation Documentation

**Last Updated:** January 2026
**Clerk Billing Version:** Beta
**Implementation Status:** ✅ Complete

---

## Table of Contents
1. [Overview](#overview)
2. [Plan Tiers & Pricing](#plan-tiers--pricing)
3. [Architecture](#architecture)
4. [Implementation Guide](#implementation-guide)
5. [Component Reference](#component-reference)
6. [API Reference](#api-reference)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)
9. [Future Enhancements](#future-enhancements)

---

## Overview

### What Was Implemented
Thumbl uses **Clerk Billing** (Beta) with Stripe integration to manage subscription plans and enforce feature restrictions. The system includes:

- ✅ 3 subscription tiers (Free, Plus, Pro)
- ✅ Monthly image generation limits
- ✅ Feature-based restrictions (quality, styles, platforms, reference images)
- ✅ Beautiful upgrade modals with lock icons
- ✅ Plan badges in navbar
- ✅ Clerk PricingTable component for payments
- ✅ Retroactive usage tracking for existing users

### Technology Stack
- **Billing Provider:** Clerk Billing (Beta)
- **Payment Gateway:** Clerk Development Gateway (test mode) / Stripe (production)
- **Authentication:** Clerk (@clerk/nextjs v6.36.5)
- **Plan Detection:** Clerk's `has({ plan: 'planName' })` method
- **No Database Changes:** Plan info retrieved from Clerk, not stored locally

---

## Plan Tiers & Pricing

### Free Plan
**Price:** $0/month
**Clerk Plan Name:** `"Free"` (case-sensitive)

**Limits:**
- 🔢 **Monthly Images:** 1 image/month
- 📸 **Reference Images:** 1 upload max
- 🎨 **Quality Options:** 1K, 2K (🔒 4K locked)
- 🖼️ **Artistic Styles:** Cinematic, Cartoon (🔒 Sketch, 3D Art, Minimalist locked)
- 📐 **Platform Formats:** YouTube (16:9) only (🔒 Instagram, LinkedIn, Reels locked)

### Plus Plan
**Price:** $5/month (or $4/month if billed annually as $48/year)
**Clerk Plan Name:** `"plus"` (lowercase)

**Limits:**
- 🔢 **Monthly Images:** 5 images/month
- 📸 **Reference Images:** 3 uploads max
- 🎨 **Quality Options:** 1K, 2K, 4K (all unlocked)
- 🖼️ **Artistic Styles:** All styles unlocked
- 📐 **Platform Formats:** All formats (16:9, 1:1, 4:5, 9:16)

### Pro Plan
**Price:** $15/month (or $13/month if billed annually as $156/year)
**Clerk Plan Name:** `"pro"` (lowercase)

**Limits:**
- 🔢 **Monthly Images:** ∞ Unlimited
- 📸 **Reference Images:** ∞ Unlimited
- 🎨 **Quality Options:** All unlocked
- 🖼️ **Artistic Styles:** All unlocked
- 📐 **Platform Formats:** All unlocked

---

## Architecture

### System Flow Diagram

```
User Action (Dashboard)
    ↓
Check Plan (getCurrentPlan())
    ↓
Check Limits (PLAN_LIMITS[plan])
    ↓
Feature Locked? → YES → Show UpgradeModal → Redirect to /pricing
    ↓ NO
Allow Action
```

### Key Components

```
src/
├── lib/
│   └── planUtils.ts              # Plan limits, helpers, constants
├── components/
│   ├── PlanBadge.tsx             # Plan badge UI (navbar)
│   ├── UpgradeModal.tsx          # Upgrade modal dialog
│   ├── NavbarClient.tsx          # Client navbar with plan
│   └── dashboard/
│       ├── DashboardClient.tsx   # Dashboard with restrictions
│       └── ControlPanel.tsx      # Form controls with lock icons
├── app/
│   ├── layout.tsx                # ClerkProvider with clerkJsVersion
│   ├── pricing/page.tsx          # Clerk PricingTable
│   ├── dashboard/page.tsx        # Server wrapper (passes plan)
│   └── actions/
│       └── thumbnailActions.ts   # getUserPlanInfo()
```

---

## Implementation Guide

### Phase 1: Clerk Setup

#### 1.1 Update ClerkProvider
**File:** `src/app/layout.tsx`

```tsx
<ClerkProvider clerkJsVersion="1.1.0">
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    {children}
  </ThemeProvider>
</ClerkProvider>
```

#### 1.2 Configure Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Billing Settings**
3. Enable Billing
4. Select **Clerk development gateway** (for testing)
5. Create 3 plans in **Subscription plans** → **Plans for Users**:
   - Free: $0/month (name: "Free")
   - Plus: $5/month (name: "plus")
   - Pro: $15/month (name: "pro")
6. Mark all plans as **Publicly available**

### Phase 2: Plan Utilities

#### 2.1 Create Plan Constants
**File:** `src/lib/planUtils.ts`

```typescript
export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    monthlyImages: 1,
    referenceImages: 1,
    qualities: ['1K', '2K'],
    styles: ['Cinematic', 'Cartoon'],
    platforms: ['16:9']
  },
  plus: {
    monthlyImages: 5,
    referenceImages: 3,
    qualities: ['1K', '2K', '4K'],
    styles: ['Cinematic', 'Cartoon', 'Sketch', '3D Art', 'Minimalist'],
    platforms: ['16:9', '1:1', '4:5', '9:16']
  },
  pro: {
    monthlyImages: Infinity,
    referenceImages: Infinity,
    qualities: ['1K', '2K', '4K'],
    styles: ['Cinematic', 'Cartoon', 'Sketch', '3D Art', 'Minimalist'],
    platforms: ['16:9', '1:1', '4:5', '9:16']
  }
}
```

#### 2.2 Plan Detection Function
```typescript
export async function getCurrentPlan(): Promise<PlanTier> {
  const { has } = await auth()

  if (has({ plan: 'pro' })) return 'pro'
  if (has({ plan: 'plus' })) return 'plus'
  return 'free' // Default for users without subscription
}
```

**How It Works:**
- Uses Clerk's `has()` method (server-side only)
- Checks plan membership from Clerk subscription
- No database queries needed
- Returns 'free' by default for non-subscribers

### Phase 3: Restrictions

#### 3.1 Client-Side Check (UI)
**File:** `src/components/dashboard/DashboardClient.tsx`

```typescript
const isLocked = (feature: string, value: string): boolean => {
  const limits = PLAN_LIMITS[userPlan]
  switch (feature) {
    case 'quality':
      return !limits.qualities.includes(value)
    case 'style':
      return !limits.styles.includes(value)
    case 'platform':
      return !limits.platforms.includes(value)
    default:
      return false
  }
}
```

#### 3.2 Lock Icon Implementation
```typescript
{SIZES.map((s) => {
  const locked = isLocked('quality', s)
  return (
    <button
      onClick={() => {
        if (locked) {
          onLockedClick(`${s} quality`, 'plus')
        } else {
          setSize(s)
        }
      }}
      className={locked ? 'bg-slate-100 cursor-pointer' : 'bg-gradient-to-r...'}
    >
      {locked && <Lock className="absolute top-1 right-1 w-3 h-3" />}
      {s}
    </button>
  )
})}
```

#### 3.3 Monthly Limit Check (Before Submit)
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Check monthly limit
  const limit = PLAN_LIMITS[userPlan].monthlyImages
  if (monthlyCount >= limit) {
    setUpgradeModal({
      open: true,
      feature: `Monthly limit (${limit} image${limit === 1 ? '' : 's'})`,
      requiredPlan: userPlan === 'free' ? 'plus' : 'pro'
    })
    return // Block submission
  }

  // Proceed with image generation...
}
```

### Phase 4: UI Components

#### 4.1 Plan Badge (Navbar)
**File:** `src/components/PlanBadge.tsx`

```typescript
export function PlanBadge({ plan }: PlanBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${PLAN_COLORS[plan]} text-white shadow-md`}>
      <span>{PLAN_ICONS[plan]}</span>
      <span>{PLAN_NAMES[plan]}</span>
    </div>
  )
}
```

**Visual:**
- Free: 🆓 Free (slate gradient)
- Plus: ⭐ Plus (blue-purple gradient)
- Pro: 👑 Pro (amber-orange gradient)

#### 4.2 Upgrade Modal
**File:** `src/components/UpgradeModal.tsx`

**Features:**
- Radix UI Dialog component
- Close button (X icon)
- Crown/Sparkles icon (plan-specific)
- Feature requirement badge
- Plan benefits list
- "View Pricing Plans" CTA (links to /pricing)
- "Maybe Later" button

```typescript
<Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-md">
    {/* Close button */}
    {/* Crown/Sparkles icon */}
    {/* "Upgrade to Plus/Pro Plan" title */}
    {/* Feature requirement badge */}
    {/* Benefits list */}
    {/* CTA buttons */}
  </DialogContent>
</Dialog>
```

#### 4.3 Pricing Page
**File:** `src/app/pricing/page.tsx`

```typescript
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Back to Dashboard button */}
      <section className="relative py-24">
        {/* Decorative background blurs */}
        <div className="container mx-auto">
          <h1>Choose Your Plan</h1>
          <PricingTable /> {/* Clerk component */}
        </div>
      </section>
    </div>
  )
}
```

**Clerk PricingTable Component:**
- Automatically renders plans from Clerk Dashboard
- Handles payment collection via Stripe
- Manages subscription creation
- Updates user's plan in Clerk

---

## Component Reference

### planUtils.ts

**Exports:**
- `PlanTier`: Type ('free' | 'plus' | 'pro')
- `PlanLimits`: Interface for plan restrictions
- `PLAN_LIMITS`: Constants for each tier
- `getCurrentPlan()`: Get user's current plan
- `checkPlanAccess()`: Check if feature is allowed
- `checkMonthlyLimit()`: Check monthly image limit
- `PLAN_COLORS`: Badge gradient colors
- `PLAN_ICONS`: Badge emoji icons
- `PLAN_NAMES`: Display names

### PlanBadge.tsx

**Props:**
- `plan`: PlanTier
- `className?`: string (optional)

**Usage:**
```tsx
<PlanBadge plan="plus" />
```

### UpgradeModal.tsx

**Props:**
- `open`: boolean
- `onClose`: () => void
- `feature`: string (e.g., "4K quality")
- `currentPlan`: 'free' | 'plus' | 'pro'
- `requiredPlan`: 'plus' | 'pro'

**Usage:**
```tsx
<UpgradeModal
  open={upgradeModal.open}
  onClose={() => setUpgradeModal({ ...upgradeModal, open: false })}
  feature="4K quality"
  currentPlan="free"
  requiredPlan="plus"
/>
```

### NavbarClient.tsx

**Props:**
- `initialPlan`: PlanTier (from server)

**Features:**
- Displays plan badge after logo
- Only visible when signed in (`<SignedIn>` wrapper)
- Uses client-side state management

---

## API Reference

### Server Actions

#### `getUserPlanInfo()`
**File:** `src/app/actions/thumbnailActions.ts`

```typescript
export async function getUserPlanInfo(): Promise<{
  plan: PlanTier
  monthlyCount: number
}>
```

**Returns:**
- `plan`: User's current plan tier
- `monthlyCount`: Number of images created this month

**Usage:**
```typescript
const { plan, monthlyCount } = await getUserPlanInfo()
```

#### `getCurrentPlan()`
**File:** `src/lib/planUtils.ts`

```typescript
export async function getCurrentPlan(): Promise<PlanTier>
```

**Returns:** User's plan tier ('free', 'plus', or 'pro')

**How It Works:**
1. Calls `await auth()` from Clerk
2. Uses `has({ plan: 'planName' })` to check subscription
3. Returns 'free' if no subscription found

#### `checkMonthlyLimit(currentCount)`
**File:** `src/lib/planUtils.ts`

```typescript
export async function checkMonthlyLimit(currentCount: number): Promise<{
  allowed: boolean
  limit: number
  remaining: number
  currentPlan: PlanTier
}>
```

**Parameters:**
- `currentCount`: Number of images created this month

**Returns:**
- `allowed`: Whether user can create more images
- `limit`: Plan's monthly limit
- `remaining`: Images remaining this month
- `currentPlan`: User's tier

---

## Testing Guide

### Manual Testing Checklist

#### Free Plan (Default)
- [ ] Badge shows "🆓 Free" in navbar
- [ ] Can create 1 image this month
- [ ] 2nd image shows upgrade modal
- [ ] Can upload 1 reference image
- [ ] 2nd reference image slot shows lock icon
- [ ] 4K quality shows lock icon
- [ ] "Sketch", "3D Art", "Minimalist" styles show lock
- [ ] Instagram, LinkedIn, Reels formats show lock
- [ ] Clicking locked option shows upgrade modal
- [ ] Modal close button works
- [ ] "View Pricing Plans" redirects to /pricing
- [ ] "Maybe Later" closes modal

#### Plus Plan
- [ ] Badge shows "⭐ Plus" in navbar
- [ ] Can create 5 images this month
- [ ] 6th image shows upgrade modal
- [ ] Can upload 3 reference images
- [ ] 4K quality unlocked
- [ ] All styles unlocked
- [ ] All platform formats unlocked
- [ ] No lock icons visible

#### Pro Plan
- [ ] Badge shows "👑 Pro" in navbar
- [ ] Can create unlimited images
- [ ] Can upload unlimited reference images
- [ ] All features unlocked
- [ ] No restrictions anywhere

### Testing Monthly Reset
1. Create image on January 31st
2. Wait until February 1st (or mock date)
3. Verify count resets to 0
4. Create new image in February
5. Verify count shows 1, not 2

### Testing Existing Users
1. Deploy pricing system
2. Sign in as existing test user
3. Verify defaults to Free plan
4. Verify restrictions apply immediately
5. Verify can upgrade through /pricing

---

## Troubleshooting

### Common Issues

#### "Plan not detected" or Always shows Free
**Cause:** Plan names mismatch between Clerk Dashboard and code

**Solution:**
1. Check Clerk Dashboard plan names:
   - Free plan: "Free" (capital F)
   - Plus plan: "plus" (lowercase)
   - Pro plan: "pro" (lowercase)
2. Ensure `has({ plan: 'planName' })` uses exact match
3. Clear browser cache and re-authenticate

#### Lock icons not showing
**Cause:** `isLocked()` function not properly checking limits

**Solution:**
1. Verify `PLAN_LIMITS` constants are correct
2. Check `userPlan` prop is passed to ControlPanel
3. Ensure `isLocked` function is called for each option

#### Modal doesn't open on locked click
**Cause:** `onLockedClick` handler not wired correctly

**Solution:**
1. Verify `handleLockedClick` is defined in DashboardClient
2. Check `onLockedClick` prop is passed to ControlPanel
3. Ensure button `onClick` calls handler when locked

#### Monthly count not resetting
**Cause:** Date calculation issue in `getMonthlyImageCount()`

**Solution:**
1. Verify `startOfMonth` uses UTC:
   ```typescript
   new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
   ```
2. Check database timestamps are stored correctly
3. Test across month boundaries

#### Clerk PricingTable not showing
**Cause:** Plans not marked as "Publicly available" in Clerk Dashboard

**Solution:**
1. Go to Clerk Dashboard → Subscription plans
2. Edit each plan
3. Toggle "Publicly available" to ON
4. Save changes

---

## Future Enhancements

### Phase 1: Usage Analytics
- [ ] Add usage dashboard showing monthly trends
- [ ] Chart of images created per day
- [ ] Comparison to previous months
- [ ] Upgrade prompts at 80%, 90%, 100% usage

### Phase 2: Plan Cache (Performance)
- [ ] Add `subscriptionTier` field to users table
- [ ] Cache plan in database on subscription change
- [ ] Use webhook to sync Clerk subscription updates
- [ ] Fallback to `getCurrentPlan()` if cache miss

### Phase 3: Advanced Restrictions
- [ ] Time-based limits (e.g., 1 image/day for Free)
- [ ] Quality degradation instead of hard lock
- [ ] Watermark for Free users
- [ ] Priority queue for Pro users

### Phase 4: Notifications
- [ ] Email when approaching limit (80%, 90%)
- [ ] In-app banner: "7 images remaining this month"
- [ ] Push notifications for limit reached
- [ ] Monthly usage report email

### Phase 5: Referral Program
- [ ] Give 1 bonus image for each referral signup
- [ ] Track referral codes
- [ ] Referral leaderboard
- [ ] Rewards for top referrers

### Phase 6: Annual Plans
- [ ] Show savings badge on annual plans
- [ ] Toggle between monthly/annual pricing
- [ ] Prorate upgrades from monthly to annual

---

## Security Considerations

### Server-Side Validation
**Important:** Always validate plan restrictions on the server, not just client-side.

**Why:**
- Client-side checks can be bypassed
- Malicious users can modify browser state
- API calls should re-verify permissions

**Implementation:**
```typescript
// In API route or server action
const { plan } = await getUserPlanInfo()
const limits = PLAN_LIMITS[plan]

if (!limits.qualities.includes(requestedQuality)) {
  throw new Error('Quality not allowed for your plan')
}
```

### Rate Limiting
Consider adding rate limiting to prevent abuse:
- Limit API calls per minute/hour
- Track failed attempts
- Block suspicious activity

---

## Monitoring & Analytics

### Key Metrics to Track
1. **Conversion Rate:** Free → Plus/Pro
2. **Churn Rate:** Subscription cancellations
3. **Monthly Recurring Revenue (MRR)**
4. **Average Revenue Per User (ARPU)**
5. **Feature Usage by Plan:**
   - % using 4K quality
   - % using advanced styles
   - Most popular platform formats

### Tools
- Clerk Dashboard: Subscription analytics
- Google Analytics: Page views, conversions
- PostHog: User behavior tracking
- Stripe Dashboard: Revenue, refunds

---

## Appendix

### Plan Comparison Table

| Feature | Free | Plus | Pro |
|---------|------|------|-----|
| **Price** | $0/mo | $5/mo | $15/mo |
| **Monthly Images** | 1 | 5 | ∞ |
| **Reference Images** | 1 | 3 | ∞ |
| **Quality (4K)** | ❌ | ✅ | ✅ |
| **All Styles** | ❌ | ✅ | ✅ |
| **All Platforms** | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ❌ | ✅ (future) |

### Code Examples

#### How to Check Plan in Component
```typescript
// Server Component
const plan = await getCurrentPlan()

// Client Component
const { plan } = props // Passed from server
```

#### How to Enforce Restriction
```typescript
// Check before action
if (userPlan === 'free' && referenceImages.length >= 1) {
  showUpgradeModal('Multiple reference images', 'plus')
  return
}

// Proceed with action...
```

#### How to Display Locked State
```typescript
const locked = isLocked('quality', '4K')

<button
  onClick={() => locked ? showUpgradeModal() : selectQuality('4K')}
  className={locked ? 'opacity-50 cursor-not-allowed' : ''}
>
  {locked && <LockIcon />}
  4K
</button>
```

---

## Support & Resources

### Documentation
- **Clerk Billing:** https://clerk.com/docs/billing
- **Clerk Has Method:** https://clerk.com/docs/has
- **Stripe:** https://stripe.com/docs

### Contact
- **Questions:** team@thumbl.com
- **Bug Reports:** GitHub Issues
- **Feature Requests:** Product Roadmap

---

**Document Version:** 1.0
**Last Review:** January 2026
**Next Review:** March 2026
