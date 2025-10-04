import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Have a question or want to work together? We'd love to hear from you. Send us a message and we'll respond
              as soon as possible.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-8 space-y-8">
                <div>
                  <h2 className="mb-6 text-2xl font-semibold text-foreground">Contact Information</h2>
                  <div className="space-y-6">
                    <ContactInfo
                      icon={<Mail className="h-5 w-5" />}
                      title="Email"
                      content="hello@example.com"
                      href="mailto:hello@example.com"
                    />
                    <ContactInfo
                      icon={<Phone className="h-5 w-5" />}
                      title="Phone"
                      content="+1 (555) 123-4567"
                      href="tel:+15551234567"
                    />
                    <ContactInfo
                      icon={<MapPin className="h-5 w-5" />}
                      title="Office"
                      content="123 Business Street, Suite 100, San Francisco, CA 94102"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="mb-3 text-lg font-semibold text-card-foreground">Business Hours</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="text-foreground">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="text-foreground">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="text-foreground">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
