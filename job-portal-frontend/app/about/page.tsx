import { Link } from "lucide-react"
import Image from "next/image"

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/placeholder.svg?height=800&width=1600"
                        alt="Background pattern"
                        layout="fill"
                        objectFit="cover"
                        className="z-0"
                    />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">About JobPortal</h1>
                    <p className="text-lg sm:text-xl lg:text-2xl opacity-90">
                        Connecting talent with opportunity, one dream job at a time.
                    </p>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        At JobPortal, our mission is to revolutionize the way people find jobs and companies discover talent. We
                        strive to create a seamless, intuitive, and empowering platform that fosters growth, innovation, and
                        meaningful connections in the professional world. We believe in a future where every individual can pursue
                        their passion and every company can build an exceptional team.
                    </p>
                </div>
            </section>



            {/* Our Values Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">Our Values</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <div className="text-blue-600 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-lightbulb mx-auto"
                                >
                                    <path d="M15 14c.2-.8 1-1.5 2-2 2.3-2.3 3.3-4.4 2.6-6.1A2 2 0 0 0 17 3c-2.2 0-4.1 1.2-6.2 3C7.1 9 4.8 12.3 4 14" />
                                    <path d="M14 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                                    <path d="M7 21l-1.4-1.4a3.5 3.5 0 0 1 0-5l1.4-1.4" />
                                    <path d="M17 14l1.4 1.4a3.5 3.5 0 0 1 0 5l-1.4 1.4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                            <p className="text-gray-700">
                                We constantly seek new ways to improve our platform and services, embracing technology to solve complex
                                challenges.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <div className="text-blue-600 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-users mx-auto"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87 4 4 0 0 0-7-1.13" />
                                    <circle cx="16" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
                            <p className="text-gray-700">
                                We foster a supportive and inclusive environment where job seekers and employers can connect and thrive.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <div className="text-blue-600 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="48"
                                    height="48"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-handshake mx-auto"
                                >
                                    <path d="m11 17 2 2 4-4" />
                                    <path d="m5 12 2 2 4-4" />
                                    <path d="M7 18c-1.5-1.5-2-4.8-3-6.8 0 0-1-2 2-3 2.7-1.4 6-1.4 8 .8" />
                                    <path d="M17 12c1.5 1.5 2 4.8 3 6.8 0 0 1 2-2 3-2.7 1.4-6 1.4-8-.8" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h3>
                            <p className="text-gray-700">
                                We operate with transparency, honesty, and a commitment to ethical practices in all our interactions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to find your next opportunity?</h2>
                    <p className="text-lg opacity-90 mb-8">
                        Join thousands of job seekers and employers who trust JobPortal for their career and hiring needs.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg"
                    >
                        Explore Jobs Now
                    </Link>
                </div>
            </section>
        </div>
    )
}
