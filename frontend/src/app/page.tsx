"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheck,
  FiGlobe,
  FiShield,
  FiZap,
  FiMenu,
  FiX,
  FiUsers,
  FiActivity,
  FiTrendingUp,
  FiChevronDown,
} from "react-icons/fi";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-(--bg-primary) bg-mesh selection:bg-blue-500/30">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-4 glass shadow-lg" : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              LuminaFX
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#how-it-works">How it Works</NavLink>
            <NavLink href="#who-we-are">About Us</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth?view=login"
              className="px-5 py-2.5 text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth?view=register"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-violet-600 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-(--text-primary) p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-(--border-subtle) p-6 animate-in">
            <div className="flex flex-col gap-4">
              <MobileNavLink
                href="#services"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </MobileNavLink>
              <MobileNavLink
                href="#how-it-works"
                onClick={() => setIsMenuOpen(false)}
              >
                How it Works
              </MobileNavLink>
              <MobileNavLink
                href="#who-we-are"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </MobileNavLink>
              <MobileNavLink
                href="#pricing"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </MobileNavLink>
              <div className="h-px bg-(--border-subtle) my-2" />
              <Link
                href="/auth?view=login"
                className="text-center py-3 font-medium"
              >
                Log in
              </Link>
              <Link
                href="/auth?view=register"
                className="text-center py-3 font-semibold text-white bg-linear-to-r from-blue-600 to-violet-600 rounded-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-8 animate-in border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Trusted by over 100k+ global users
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-in"
            style={{ animationDelay: "0.1s" }}
          >
            Master Your Money <br />
            <span className="bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Beyond Borders
            </span>
          </h1>
          <p
            className="text-xl text-(--text-secondary) mb-10 max-w-2xl mx-auto leading-relaxed animate-in"
            style={{ animationDelay: "0.2s" }}
          >
            The all-in-one digital wallet for the modern era. Exchange,
            transfer, and manage 50+ currencies with lightning speed and
            bank-grade security.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/auth?view=register"
              className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-violet-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Create Free Account <FiArrowRight />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 bg-white text-(--text-primary) font-bold rounded-2xl border border-(--border-subtle) hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              See How It Works
            </Link>
          </div>

          {/* Hero Visual - Dashboard Preview */}
          <div
            className="mt-20 relative animate-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="absolute -inset-4 bg-linear-to-r from-blue-500 to-violet-500 opacity-20 blur-3xl rounded-[3rem]" />
            <div className="relative glass border-(--border-subtle) rounded-3xl p-4 md:p-8 shadow-2xl overflow-hidden">
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                {/* Decorative Dashboard Mockup Elements */}
                <div className="w-full h-full p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/10" />
                      <div className="flex flex-col gap-2">
                        <div className="w-32 h-3 bg-white/20 rounded" />
                        <div className="w-20 h-2 bg-white/10 rounded" />
                      </div>
                    </div>
                    <div className="w-24 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30" />
                  </div>
                  <div className="grid grid-cols-3 gap-6 flex-1">
                    <div className="col-span-2 bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col gap-4">
                      <div className="w-full h-32 bg-white/5 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-500/10" />
                        <div className="absolute inset-0 flex items-end">
                          <svg
                            className="w-full h-1/2 text-blue-500/40"
                            viewBox="0 0 400 100"
                          >
                            <path
                              d="M0,80 Q50,20 100,50 T200,30 T300,70 T400,10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1 h-20 bg-white/5 rounded-lg" />
                        <div className="flex-1 h-20 bg-white/5 rounded-lg" />
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col gap-3">
                      <div className="w-full h-4 bg-white/20 rounded" />
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center py-2 border-b border-white/5"
                        >
                          <div className="w-8 h-8 rounded-full bg-white/10" />
                          <div className="w-24 h-2 bg-white/10 rounded" />
                          <div className="w-12 h-3 bg-green-500/40 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 border-y border-(--border-subtle)">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              icon={<FiUsers className="text-blue-500" />}
              value="120k+"
              label="Active Users"
            />
            <StatCard
              icon={<FiActivity className="text-violet-500" />}
              value="$2.4B+"
              label="Annual Volume"
            />
            <StatCard
              icon={<FiGlobe className="text-emerald-500" />}
              value="190+"
              label="Countries Supported"
            />
            <StatCard
              icon={<FiTrendingUp className="text-amber-500" />}
              value="50+"
              label="Currencies"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Financial Services for the{" "}
              <span className="gradient-text">Future</span>
            </h2>
            <p className="text-(--text-secondary) max-w-2xl mx-auto text-lg">
              We've re-imagined banking to be as global as you are. Seamless
              integration between traditional finance and the digital economy.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <ServiceCard
              icon={<FiGlobe size={32} />}
              title="Multi-Currency Accounts"
              description="Hold, receive, and send money in 50+ currencies. No hidden fees, just real exchange rates."
              color="blue"
            />
            <ServiceCard
              icon={<FiZap size={32} />}
              title="Instant Transfers"
              description="Send money across the globe in seconds. Most transfers are completed instantly between LuminaFX users."
              color="violet"
            />
            <ServiceCard
              icon={<FiShield size={32} />}
              title="Bank-Grade Security"
              description="Your funds are protected by multi-signature wallets and state-of-the-art encryption standards."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="py-32 bg-slate-900 text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Getting Started is <br />
                <span className="text-blue-400">Easy as 1-2-3</span>
              </h2>
              <div className="space-y-12">
                <Step
                  number="01"
                  title="Register Your Account"
                  description="Sign up in minutes with just your email. No paperwork, no hassle."
                />
                <Step
                  number="02"
                  title="Verify Your Identity"
                  description="Complete a quick 30-second KYC to unlock full account features."
                />
                <Step
                  number="03"
                  title="Start Exchanging"
                  description="Deposit funds and start moving money globally at mid-market rates."
                />
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="w-full aspect-square max-w-md mx-auto rounded-[3rem] bg-linear-to-br from-blue-500/20 to-violet-600/20 border border-white/10 p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative h-full flex flex-col justify-center gap-6">
                  <div className="p-6 bg-white/10 rounded-2xl border border-white/10 transform translate-x-[-20px] shadow-xl">
                    <div className="w-12 h-3 bg-blue-400/40 rounded mb-3" />
                    <div className="w-full h-2 bg-white/20 rounded" />
                  </div>
                  <div className="p-6 bg-blue-600 rounded-2xl shadow-2xl z-20 scale-110 border border-white/20">
                    <div className="flex justify-between mb-4">
                      <div className="w-10 h-10 rounded-full bg-white/20" />
                      <FiZap className="text-white" />
                    </div>
                    <div className="text-white font-bold mb-2">
                      Transfer Successful
                    </div>
                    <div className="text-blue-100 text-sm">
                      $1,240.00 USD sent to Alex
                    </div>
                  </div>
                  <div className="p-6 bg-white/10 rounded-2xl border border-white/10 transform translate-x-[20px] opacity-60">
                    <div className="w-16 h-3 bg-violet-400/40 rounded mb-3" />
                    <div className="w-full h-2 bg-white/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="who-we-are" className="py-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="w-full aspect-square rounded-3xl bg-slate-100 flex items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-tr from-blue-100 to-violet-100 opacity-50" />
                <div className="relative text-center">
                  <div className="text-8xl mb-4">🌍</div>
                  <div className="text-2xl font-bold text-slate-800">
                    Our Mission
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">
                Who we are
              </span>
              <h2 className="text-4xl font-bold mb-6">
                Democratizing Global Finance
              </h2>
              <p className="text-lg text-(--text-secondary) mb-6 leading-relaxed">
                Founded in 2023, LuminaFX was born from a simple idea: moving
                money across borders should be as easy and cheap as sending a
                text message.
              </p>
              <p className="text-lg text-(--text-secondary) mb-8 leading-relaxed">
                We are a team of financial experts and tech visionaries building
                a fairer, more transparent financial system for everyone,
                everywhere.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">
                    <FiCheck size={20} />
                  </div>
                  <span className="font-medium">FCA Regulated</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">
                    <FiCheck size={20} />
                  </div>
                  <span className="font-medium">100% Transparent</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">
                    <FiCheck size={20} />
                  </div>
                  <span className="font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-blue-500">
                    <FiCheck size={20} />
                  </div>
                  <span className="font-medium">Global Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-(--text-secondary) max-w-2xl mx-auto text-lg">
              No monthly fees for basic use. Upgrade as your needs grow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              title="Personal"
              price="0"
              description="Perfect for individuals moving money occasionally."
              features={[
                "5 Free Transfers / Month",
                "10 Currencies Supported",
                "Email Support",
                "Mobile App Access",
              ]}
            />
            <PricingCard
              title="Premium"
              price="12"
              isFeatured={true}
              description="For frequent travelers and digital nomads."
              features={[
                "Unlimited Transfers",
                "50+ Currencies Supported",
                "Priority Support",
                "Physical & Virtual Cards",
              ]}
            />
            <PricingCard
              title="Business"
              price="49"
              description="Designed for global businesses and enterprises."
              features={[
                "Bulk Payments API",
                "Multi-user Access",
                "Dedicated Account Manager",
                "Custom FX Rates",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-white">LuminaFX</span>
              </div>
              <p className="mb-6">
                Modernizing the global financial landscape, one transaction at a
                time.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  f
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer">
                  t
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  in
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
                Product
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#services"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth?view=login"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth?view=register"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
                Company
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#who-we-are"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">
                Contact
              </h4>
              <ul className="space-y-4">
                <li>support@luminafx.com</li>
                <li>+1 (555) 000-0000</li>
                <li>San Francisco, CA</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-10 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} LuminaFX Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-(--text-secondary) hover:text-blue-600 transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-lg font-medium py-2 border-b border-(--border-subtle)/50"
    >
      {children}
    </Link>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center group">
      <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-(--text-secondary) font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "violet" | "emerald";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group hover:-translate-y-2">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-transform group-hover:rotate-6 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-(--text-secondary) leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6 group">
      <div className="shrink-0 text-4xl font-black text-white/10 group-hover:text-blue-500/40 transition-colors">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-bold mb-2 text-white">{title}</h4>
        <p className="text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  isFeatured = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
}) {
  return (
    <div
      className={`p-10 rounded-[3rem] transition-all transform hover:-translate-y-2 ${
        isFeatured
          ? "bg-slate-900 text-white shadow-2xl scale-105 relative z-10"
          : "bg-white border border-slate-200"
      }`}
    >
      {isFeatured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 text-xs font-bold rounded-full uppercase tracking-widest">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className={isFeatured ? "text-slate-400" : "text-slate-500"}>
          /month
        </span>
      </div>
      <p
        className={`text-sm mb-8 ${isFeatured ? "text-slate-400" : "text-slate-500"}`}
      >
        {description}
      </p>
      <div className="h-px w-full bg-slate-200 mb-8 opacity-20" />
      <ul className="space-y-4 mb-10">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <FiCheck className="text-blue-500 shrink-0" />
            <span className={isFeatured ? "text-slate-300" : "text-slate-700"}>
              {f}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/auth?view=register"
        className={`block w-full py-4 rounded-2xl text-center font-bold transition-all ${
          isFeatured
            ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
            : "bg-slate-100 text-slate-900 hover:bg-slate-200"
        }`}
      >
        Choose Plan
      </Link>
    </div>
  );
}
