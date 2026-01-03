"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, Mail, MessageSquare } from "lucide-react"

const footerLinks = {
    product: [
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Showcase", href: "/showcase" },
    ],
    resources: [
        { label: "Documentation", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Community", href: "#" },
    ],
    legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ],
}

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
    return (
        <footer className="relative mt-24 border-t border-white/5 bg-slate-950/80 pt-16 pb-8 backdrop-blur-xl overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute bottom-[-150px] left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-4">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/images/iocnnavbar.png"
                                alt="Thumbl logo"
                                width={32}
                                height={32}
                                className="h-8 w-8"
                            />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                                Thumbl
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Elevate your content with stunning, AI-powered thumbnails. Professional design in seconds, not hours.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className="rounded-full bg-white/5 p-2 text-muted-foreground transition-all hover:bg-white/10 hover:text-white"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="mb-6 font-semibold">Product</h3>
                        <ul className="space-y-4">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-purple-500">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 font-semibold">Resources</h3>
                        <ul className="space-y-4">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-purple-500">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 font-semibold">Support</h3>
                        <div className="space-y-4">
                            <Link href="/#contact" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-purple-500">
                                <Mail className="h-4 w-4" />
                                support@thumbl.com
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageSquare className="h-4 w-4" />
                                24/7 Live Chat
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Thumbl AI. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {footerLinks.legal.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-xs text-muted-foreground transition-colors hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
