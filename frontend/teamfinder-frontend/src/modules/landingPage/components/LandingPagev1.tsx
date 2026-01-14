import { Users, Lightbulb, Zap, Trophy, Quote } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";

function TeamFinderSections() {
    const testimonials = [
        {
            quote:
                "Half of the offers I give are sourced from Wellfound. It's the best product for anyone looking for startup talent.",
            author: "Sarah Johnson",
            role: "Head of Talent",
            company: "TechStartup Inc.",
        },
        {
            quote:
                "TeamFinder helped me find the perfect co-founder for my hackathon project. We ended up winning first place!",
            author: "Alex Chen",
            role: "Software Engineer",
            company: "Google",
        },
        {
            quote:
                "I've never seen a platform that makes team building this easy. Found my entire team in under 24 hours.",
            author: "Maria Garcia",
            role: "Product Designer",
            company: "Airbnb",
        },
        {
            quote:
                "I've never seen a platform that makes team building this easy. Found my entire team in under 24 hours.",
            author: "Mary Ellis David",
            role: "Product Manager",
            company: "Dropbox",
        },
    ];
    return (
        <div className="overflow-y-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-br to-blue-600 from-blue-800 text-white py-4 px-4">
                <div className="max-w-6xl mx-auto text-center flex justify-between items-center">
                    <p className="text-xl font-bold">TeamFinder</p>
                    <div className="flex space-x-4">
                        <Button variant="outline" className="text-black">
                            Log In
                        </Button>
                        <Button className="bg-sky-400 hover:bg-sky-800">Sign Up</Button>
                    </div>
                </div>
            </div>

            {/* Two Column Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Section - Looking for Team Members */}
                        <div className="bg-gradient-to-br from-sky-100 to-sky-50 rounded-2xl shadow-lg p-8">
                            <div className="mb-6">
                                <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">
                                    Looking for People?
                                </p>
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    What is in it for teams
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Connect directly with talented individuals ready to join
                                            your team - no middlemen, just genuine connections.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                                        <Lightbulb className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Post your team details for the hackathon you're attending.
                                            Find people who align with your goals.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                                        <Zap className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Browse profiles, review skills and chat with potential
                                            members to join your team with one click.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                                        <Trophy className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Find committed team members who want to build something
                                            great, not just browse opportunities.
                                        </p>
                                    </div>
                                </div>

                                <Link to="/find-teammates" className="block">
                                    <Button className="hover:bg-blue-200 hover:text-black w-full">
                                        Find your next teammate
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Section - Looking for Teams */}
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl shadow-lg p-8">
                            <div className="mb-6">
                                <p className="text-rose-600 font-semibold text-sm uppercase tracking-wide mb-2">
                                    Looking for a Team?
                                </p>
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    What is in it for individuals
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-rose-100 rounded-full p-3 flex-shrink-0">
                                        <Users className="w-6 h-6 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Discover teams looking for your exact skillset & connect
                                            with collaborators directly.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-rose-100 rounded-full p-3 flex-shrink-0">
                                        <Lightbulb className="w-6 h-6 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed">
                                            See team composition, tech stack and chat with them before
                                            you apply. No surprises.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-rose-100 rounded-full p-3 flex-shrink-0">
                                        <Zap className="w-6 h-6 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Create your profile once and express interest in events.
                                            Your skills speak for themselves.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-rose-100 rounded-full p-3 flex-shrink-0">
                                        <Trophy className="w-6 h-6 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 leading-relaxed">
                                            Join passionate or familiar teams participating in
                                            hackathons you can't find on traditional job boards.
                                        </p>
                                    </div>
                                </div>

                                <Link to="/find-team" className="block">
                                    <Button className="hover:bg-red-200 hover:text-black w-full">
                                        Find your next team
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="m-4 rounded-lg bg-gradient-to-br from-cyan-700 to-cyan-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div>
                            <h2 className="text-6xl md:text-7xl font-extrabold">0</h2>
                            <p className="mt-4 text-lg text-gray-200">Matches Made</p>
                        </div>

                        <div>
                            <h2 className="text-6xl md:text-7xl font-extrabold">0</h2>
                            <p className="mt-4 text-lg text-gray-200">Events</p>
                        </div>

                        <div>
                            <h2 className="text-6xl md:text-7xl font-extrabold">0</h2>
                            <p className="mt-4 text-lg text-gray-200">Ready Candidates</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Helper Section */}
            <div className="mx-12 rounded-lg bg-gradient-to-br from-sky-700 to-cyan-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12 lg:text-center">
                        <div>
                            <h2 className="text-6xl md:text-7xl font-extrabold">
                                Meet TeamFinder's AI Helper
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="m-4 rounded-lg text-white py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center flex flex-col">
                        <div>
                            <p className="text-2xl mb-2 md:text-4xl font-extrabold text-black">
                                What people are saying
                            </p>
                            <p className="m-4 text-black">
                                Hear from teams and individuals who found their perfect match
                            </p>
                        </div>

                        {/* Auto-scrolling horizontal carousel */}
                        <div className="overflow-x-hidden w-full relative">
                            <div
                                className="flex gap-8 animate-scroll-x"
                                style={{
                                    width: `calc(3 * 380px * 2)`, // 3 cards, 380px each, duplicated for seamless loop
                                }}
                            >
                                {/* Duplicate testimonials for seamless loop */}
                                {[...testimonials, ...testimonials].map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 min-w-[380px] max-w-[380px] flex-shrink-0"
                                    >
                                        {/* Quote Icon */}
                                        <div className="flex justify-center mb-6">
                                            <div className="bg-rose-100 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                                                <div className="flex items-center gap-1">
                                                    <Quote className="w-6 h-6 text-sky-500 transform rotate-180" />
                                                    <Quote className="w-6 h-6 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quote Text */}
                                        <blockquote className="text-gray-800 text-lg leading-relaxed mb-6 text-center">
                                            "{testimonial.quote}"
                                        </blockquote>

                                        {/* Author Info */}
                                        <div className="text-center border-t border-rose-200 pt-6">
                                            <p className="font-semibold text-gray-900">
                                                {testimonial.author}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {testimonial.role}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {testimonial.company}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Carousel animation style */}
                        <style>{`
                            @keyframes scroll-x {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-1140px); }
                            }
                            .animate-scroll-x {
                                animation: scroll-x 18s linear infinite;
                            }
                        `}</style>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white pt-20 pb-5 px-4 md:pr-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col">
                        {/* Main Footer Content */}
                        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-0">
                            {/* Logo */}
                            <div className="text-center lg:text-left">
                                <p className="text-4xl md:text-5xl lg:text-6xl font-bold">
                                    teamfinder
                                </p>
                            </div>

                            {/* Footer Links */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
                                {/* For Individuals */}
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold mb-4">For Individuals</p>
                                    <ul className="flex flex-col space-y-2">
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            Overview
                                        </Link>
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            Find Teams
                                        </Link>
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            Let Teams Find You
                                        </Link>
                                    </ul>
                                </div>

                                {/* For Teams */}
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold mb-4">For Teams</p>
                                    <ul className="flex flex-col space-y-2">
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            Overview
                                        </Link>
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            Find People
                                        </Link>
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            Let People Find You
                                        </Link>
                                    </ul>
                                </div>

                                {/* Company */}
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold mb-4">Company</p>
                                    <ul className="flex flex-col space-y-2">
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            About
                                        </Link>
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            Trust
                                        </Link>
                                        <Link
                                            to="/"
                                            className="hover:text-blue-200 transition-colors"
                                        >
                                            Blog
                                        </Link>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="mt-10 pt-6 border-t border-blue-600">
                            <p className="text-center text-sm md:text-base">
                                Copyright © 2026 TeamFinder. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamFinderSections;
