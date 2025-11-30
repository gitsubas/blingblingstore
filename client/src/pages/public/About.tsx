import { Badge } from "../../components/ui/Badge";

export function About() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <Badge variant="secondary" className="mb-2">Our Story</Badge>
                <h1 className="text-4xl font-bold text-gray-900">About BlingBling</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Bringing elegance and style to your doorstep since 2023. We believe in quality, affordability, and unique designs.
                </p>
            </div>

            {/* Mission Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        At BlingBling, our mission is to curate a collection of lifestyle products that bring joy and beauty to everyday life. From exquisite jewelry to stylish home decor, we handpick every item to ensure it meets our high standards of quality and aesthetics.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        We are committed to sustainable practices and supporting local artisans whenever possible.
                    </p>
                </div>
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
                        alt="Our Store"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Values Section */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center text-gray-900">Why Choose Us?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Quality Assurance",
                            description: "Every product is rigorously tested to ensure it lasts.",
                            icon: "✨"
                        },
                        {
                            title: "Fast Shipping",
                            description: "We ship worldwide with tracking and insurance.",
                            icon: "🚀"
                        },
                        {
                            title: "24/7 Support",
                            description: "Our dedicated team is here to help you anytime.",
                            icon: "💬"
                        }
                    ].map((value, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
                            <div className="text-4xl">{value.icon}</div>
                            <h3 className="font-bold text-lg text-gray-900">{value.title}</h3>
                            <p className="text-gray-600 text-sm">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
