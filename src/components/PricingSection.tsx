"use client"

import Link from 'next/link'
import { Check, X, Crown, Star, Rocket } from 'lucide-react'

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    icon: Star,
    iconColor: "text-slate-500",
    gradientFrom: "from-slate-400",
    gradientTo: "to-slate-600",
    popular: false,
    features: [
      { text: "1 image per month", included: true },
      { text: "1 reference image", included: true },
      { text: "1K-2K quality", included: true },
      { text: "Basic styles (2)", included: true },
      { text: "YouTube format only", included: true },
      { text: "4K quality", included: false },
      { text: "All platform formats", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/dashboard",
    ctaGradient: "from-slate-500 to-slate-700"
  },
  {
    name: "Plus",
    price: "5",
    period: "month",
    icon: Rocket,
    iconColor: "text-purple-500",
    gradientFrom: "from-blue-500",
    gradientTo: "to-purple-600",
    popular: true,
    features: [
      { text: "5 images per month", included: true },
      { text: "3 reference images", included: true },
      { text: "Up to 4K quality", included: true },
      { text: "All artistic styles", included: true },
      { text: "All platform formats", included: true },
      { text: "Priority support", included: false },
    ],
    cta: "Upgrade to Plus",
    ctaLink: "/pricing",
    ctaGradient: "from-blue-500 to-purple-600"
  },
  {
    name: "Pro",
    price: "15",
    period: "month",
    icon: Crown,
    iconColor: "text-amber-500",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    popular: false,
    features: [
      { text: "Unlimited images", included: true },
      { text: "Unlimited references", included: true },
      { text: "4K quality", included: true },
      { text: "All artistic styles", included: true },
      { text: "All platform formats", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Go Pro",
    ctaLink: "/pricing",
    ctaGradient: "from-amber-500 to-orange-600"
  }
]

export function PricingSection() {
  return (
    <section id="pricing" className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 py-24 sm:py-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Start creating stunning thumbnails today. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl border-2 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  plan.popular
                    ? 'border-purple-300 ring-4 ring-purple-100'
                    : 'border-slate-200 hover:border-purple-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}

                {/* Plan Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${plan.gradientFrom} ${plan.gradientTo} shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className={`text-2xl font-bold text-center mb-2 bg-gradient-to-r ${plan.gradientFrom} ${plan.gradientTo} bg-clip-text text-transparent`}>
                  {plan.name}
                </h3>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className={`text-5xl font-extrabold bg-gradient-to-r ${plan.gradientFrom} ${plan.gradientTo} bg-clip-text text-transparent`}>${plan.price}</span>
                    <span className="text-slate-600 ml-2">/{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 mt-0.5 mr-3 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 px-6 rounded-full bg-gradient-to-r ${plan.ctaGradient} text-white text-center font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110`}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            All plans include access to our AI-powered thumbnail generator.{' '}
            <Link href="/pricing" className="text-purple-600 hover:text-purple-700 font-medium underline">
              View detailed pricing
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
