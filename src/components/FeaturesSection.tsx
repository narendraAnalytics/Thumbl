"use client"

import React from 'react'
import {
    Layout,
    Languages,
    Zap,
    ImagePlus,
    Palette,
    Sparkles,
    Search,
    CheckCircle2
} from 'lucide-react'

const features = [
    {
        title: "Platform Optimized",
        description: "Perfect aspect ratios for YouTube (16:9), Instagram/Facebook (9:16), and LinkedIn (3:4).",
        icon: Layout,
        color: "from-blue-400 to-cyan-400"
    },
    {
        title: "Multilingual AI",
        description: "Support for 6+ languages: English, Hindi, Telugu, Tamil, Marathi, and Kannada.",
        icon: Languages,
        color: "from-purple-400 to-pink-400"
    },
    {
        title: "Smart Prompt Magic",
        description: "Gemini-powered prompt enhancement transforms simple ideas into viral visual concepts.",
        icon: Zap,
        color: "from-yellow-400 to-orange-400"
    },
    {
        title: "Visual References",
        description: "Upload up to 3 images to guide the AI on your brand style, face, or specific composition.",
        icon: ImagePlus,
        color: "from-emerald-400 to-teal-400"
    },
    {
        title: "Premium Art Styles",
        description: "Choose from Cinematic, Cartoon, Sketch, 3D Art, or Minimalist to match your brand.",
        icon: Palette,
        color: "from-indigo-400 to-violet-400"
    },
    {
        title: "Ultra HD Quality",
        description: "Professional high-resolution output (1K, 2K, 4K) ready for immediate social media use.",
        icon: Sparkles,
        color: "from-rose-400 to-orange-400"
    }
]

export function FeaturesSection() {
    return (
        <section id="features" className="relative bg-[#fafafa] py-24 sm:py-32 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Powerful Features for <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Viral Content</span>
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Thumbl combines elite AI models with professional design workflows to help you create stunning thumbnails in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-8 rounded-3xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-blue-200"
                        >
                            {/* Feature Icon */}
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                                    <feature.icon className={`w-7 h-7 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                                </div>
                            </div>

                            {/* Feature Content */}
                            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2 transition-colors group-hover:text-blue-600">
                                {feature.title}
                                <CheckCircle2 className="w-4 h-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Decorative corner gradient */}
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-500`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
