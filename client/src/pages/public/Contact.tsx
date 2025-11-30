import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        setTimeout(() => {
            setSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h3 className="font-bold text-lg text-gray-900">Contact Information</h3>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Email</p>
                                <p className="text-gray-600 text-sm">support@blingbling.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Phone</p>
                                <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Office</p>
                                <p className="text-gray-600 text-sm">123 Fashion Street,<br />New York, NY 10001</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2">
                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                        {submitted ? (
                            <div className="text-center py-12 space-y-4">
                                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                    <Send className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                                <p className="text-gray-600">Thank you for contacting us. We'll get back to you shortly.</p>
                                <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Name</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Subject</label>
                                    <Input
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Message</label>
                                    <textarea
                                        className="flex min-h-[150px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        placeholder="Write your message here..."
                                    />
                                </div>
                                <Button type="submit" className="w-full">Send Message</Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-6 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-900">Frequently Asked Questions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { q: "What is your return policy?", a: "We accept returns within 30 days of purchase for a full refund." },
                        { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide." },
                        { q: "How can I track my order?", a: "You can track your order in the 'My Orders' section of your dashboard." },
                        { q: "Are your products authentic?", a: "Yes, we guarantee 100% authenticity for all our products." }
                    ].map((faq, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                            <p className="text-gray-600 text-sm">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
