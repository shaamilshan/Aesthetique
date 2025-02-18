import React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Get in Touch</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name" className="border-gray-300" />
                <Input placeholder="Your Email*" required type="email" className="border-gray-300" />
              </div>
              <Input placeholder="Phone Number" className="border-gray-300" />
              <Textarea placeholder="Your Message" className="border-gray-300 h-32" />
              <Button className="w-full bg-black hover:bg-gray-700 text-white">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg p-6">
  <CardHeader>
    <CardTitle className="text-2xl">Contact Details</CardTitle>
  </CardHeader>
  <CardContent className="space-y-8">
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Mail className="text-primary" />
        <a href="mailto:trendkartonline@gmail.com" className="text-lg hover:underline">
          trendkartonline@gmail.com
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <Phone className="text-primary" />
        <a href="tel:+919037395052" className="text-lg hover:underline">
          +91 90373 95052
        </a>
      </div>
    </div>
    <div className="flex items-start space-x-4">
      <MapPin className="text-primary flex-shrink-0 mt-1" />
      <p className="text-lg leading-relaxed">
        Trend Kart, Karassery junction, Mukkam, Calicut, Kerala, India 673602
      </p>
    </div>
    <div className="space-y-4">
      <a
        href="https://www.instagram.com/trend_kart_mukkam_?igsh=MWVoZGQzczNvMWRpcA%3D%3D&utm_source=qr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-4 hover:text-primary transition-colors"
      >
        <Instagram />
        <span className="text-lg">trend_kart_mukkam_</span>
      </a>
      <a
        href="https://www.facebook.com/profile.php?id=100093293153667&mibextid=LQQJ4d"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-4 hover:text-primary transition-colors"
      >
        <Facebook />
        <span className="text-lg">Trend Kart Facebook</span>
      </a>
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  )
}