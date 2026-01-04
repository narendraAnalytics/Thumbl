"use client"

import * as React from "react"
import { Mail, MessageSquare, MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export function ContactSection() {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        alert("Message sent successfully!")
    }

    return (
        <section id="contact" className="relative overflow-hidden py-24 lg:py-32">
            {/* Background Decorative Elements */}
            <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
            <div className="absolute right-0 top-1/2 -z-10 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-500/10 blur-[100px]" />

            <div className="container relative px-4 md:px-6">
                <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row">

                    {/* Left Side: Contact Info */}
                    <div className="flex flex-1 flex-col justify-center space-y-8">
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
                                Get in Touch
                            </h2>
                            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl lg:mx-0">
                                Have questions or need help? We're here for you. Send us a message and we'll get back to you as soon as possible.
                            </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                            {/* Contact Cards */}
                            {[
                                {
                                    icon: Mail,
                                    title: "Email Us",
                                    value: "narendra.insights@gmail.com",
                                    color: "bg-blue-500/10 text-blue-600"
                                },
                                {
                                    icon: MessageSquare,
                                    title: "Live Chat",
                                    value: "Available 24/7",
                                    color: "bg-purple-500/10 text-purple-600"
                                },
                                {
                                    icon: MapPin,
                                    title: "Office",
                                    value: "Amaravathi",
                                    color: "bg-pink-500/10 text-pink-600"
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10"
                                >
                                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", item.color)}>
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="flex-1">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-2xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            placeholder="John Doe"
                                            required
                                            className="border-white/10 bg-white/5 focus-visible:ring-purple-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                            className="border-white/10 bg-white/5 focus-visible:ring-purple-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Input
                                        placeholder="How can we help?"
                                        required
                                        className="border-white/10 bg-white/5 focus-visible:ring-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea
                                        placeholder="Tell us more about your inquiry..."
                                        className="min-h-[150px] border-white/10 bg-white/5 focus-visible:ring-purple-500"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-6 text-lg font-semibold text-white shadow-xl transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="mr-2 h-5 w-5" />
                                    )}
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
