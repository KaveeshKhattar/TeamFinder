import { Users, Lightbulb, Zap, Trophy, Quote, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import Header from "./Header";

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
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Two Column Section */}
                <section className="py-12">
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                        {/* Left Section - Looking for Team Members */}
                        <div className="border border-border rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 bg-card">
                            <div className="mb-6 sm:mb-8">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">
                                    Looking for People?
                                </p>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
                                    What is in it for teams
                                </h2>
                            </div>

                            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md p-2 bg-muted flex-shrink-0">
                                        <Users className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Connect directly with talented individuals ready to join
                                            your team - no middlemen, just genuine connections.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-md p-2 bg-muted flex-shrink-0">
                                        <Lightbulb className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Post your team details for the hackathon you're attending.
                                            Find people who align with your goals.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-md p-2 bg-muted flex-shrink-0">
                                        <Zap className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Browse profiles, review skills and chat with potential
                                            members to join your team with one click.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-md p-2 bg-muted flex-shrink-0">
                                        <Trophy className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Find committed team members who want to build something
                                            great, not just browse opportunities.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link to="/find-teammates" className="block">
                                    <Button className="w-full" variant="default">
                                        Find your next teammate
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>

                                <Link to="/post-your-team" className="block">
                                    <Button className="w-full" variant="outline">
                                        Post your team
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Section - Looking for Teams */}
                        <div className="border border-border rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 bg-card">
                            <div className="mb-6 sm:mb-8">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 sm:mb-3">
                                    Looking for a Team?
                                </p>
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6">
                                    What is in it for individuals
                                </h2>
                            </div>

                            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md p-2 bg-muted flex-shrink-0">
                                        <Users className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Discover teams looking for your exact skillset & connect
                                            with collaborators directly.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-md p-2 bg-muted flex-shrink-0">
                                        <Lightbulb className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            See team composition, tech stack and chat with them before
                                            you apply. No surprises.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-md p-2 bg-muted flex-shrink-0">
                                        <Zap className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Create your profile once and express interest in events.
                                            Your skills speak for themselves.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="rounded-md p-2 bg-muted flex-shrink-0">
                                        <Trophy className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Join passionate or familiar teams participating in
                                            hackathons you can't find on traditional job boards.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link to="/find-team" className="block">
                                    <Button className="w-full" variant="default">
                                        Find your next team
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>

                                <Link to="/show-interest" className="block">
                                    <Button className="w-full" variant="outline">
                                        Show your interest
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 sm:py-16 md:py-24 border-t border-border">
                    <div className="grid md:grid-cols-3 gap-8 sm:gap-12 text-center">
                        <div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-2 sm:mb-3">0</h2>
                            <p className="text-sm sm:text-base text-muted-foreground">Matches Made</p>
                        </div>

                        <div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-2 sm:mb-3">5+</h2>
                            <p className="text-sm sm:text-base text-muted-foreground">Events</p>
                        </div>

                        <div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-2 sm:mb-3">5+</h2>
                            <p className="text-sm sm:text-base text-muted-foreground">Ready Candidates</p>
                        </div>
                    </div>
                </section>

                {/* AI Helper Section */}
                <section className="py-12 sm:py-16 md:py-24 border-t border-border">
                    <div className="text-center px-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4">
                            TeamFinder's AI Helper
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                            Coming soon
                        </p>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-12 sm:py-16 md:py-24 border-t border-border">
                    <div className="text-center mb-8 sm:mb-12 px-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2 sm:mb-3">
                            What people are saying
                        </h2>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Hear from teams and individuals who found their perfect match
                        </p>
                    </div>

                    {/* Auto-scrolling horizontal carousel */}
                    <div className="overflow-x-hidden w-full relative px-4">
                        <div className="flex gap-4 sm:gap-6 animate-scroll-x">
                            {[...testimonials, ...testimonials].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="border border-border rounded-lg p-4 sm:p-6 md:p-8 bg-card hover:shadow-md transition-shadow duration-300 min-w-[280px] sm:min-w-[320px] md:min-w-[380px] max-w-[280px] sm:max-w-[320px] md:max-w-[380px] flex-shrink-0"
                                >
                                    <div className="flex justify-center mb-6">
                                        <div className="rounded-full p-3 bg-muted">
                                            <Quote className="w-5 h-5 text-foreground" />
                                        </div>
                                    </div>

                                    <blockquote className="text-foreground text-base leading-relaxed mb-6 text-center">
                                        "{testimonial.quote}"
                                    </blockquote>

                                    <div className="text-center border-t border-border pt-6">
                                        <p className="font-medium text-foreground">
                                            {testimonial.author}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.role}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <style>{`
                        @keyframes scroll-x {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-1140px); }
                        }
                        .animate-scroll-x {
                            animation: scroll-x 18s linear infinite;
                        }
                        @media (max-width: 640px) {
                            @keyframes scroll-x {
                                0% { transform: translateX(0); }
                                100% { transform: translateX(-840px); }
                            }
                        }
                    `}</style>
                </section>
            </main>

            {/* Footer Section */}
            <footer className="border-t border-border mt-12 sm:mt-16 md:mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-8 sm:gap-12 lg:gap-0">
                        {/* Logo */}
                        <div className="text-center lg:text-left">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                                TeamFinder
                            </h3>
                        </div>

                        {/* Footer Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
                            {/* For Individuals */}
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold mb-4">For Individuals</p>
                                <ul className="flex flex-col space-y-3">
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Overview
                                    </Link>
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Find Teams
                                    </Link>
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Let Teams Find You
                                    </Link>
                                </ul>
                            </div>

                            {/* For Teams */}
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold mb-4">For Teams</p>
                                <ul className="flex flex-col space-y-3">
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Overview
                                    </Link>
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Find People
                                    </Link>
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Let People Find You
                                    </Link>
                                </ul>
                            </div>

                            {/* Company */}
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold mb-4">Company</p>
                                <ul className="flex flex-col space-y-3">
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        About
                                    </Link>
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Trust
                                    </Link>
                                    <Link
                                        to="/"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Blog
                                    </Link>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
                        <p className="text-center text-xs sm:text-sm text-muted-foreground">
                            Copyright © 2026 TeamFinder. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default TeamFinderSections;
