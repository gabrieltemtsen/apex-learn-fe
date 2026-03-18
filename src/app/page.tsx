import Link from 'next/link';
import {
  BookOpen, Users, Award, BarChart3, Shield, Zap, Globe, Brain,
  ChevronRight, Star, CheckCircle2, Building2, Landmark, Briefcase,
  GraduationCap, Trophy, Layers
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const TRUST_LOGOS = ['NITDA', 'NUC', 'NBTE', 'NASENI', 'Galaxy Backbone', 'JAMB'];

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Training from Experts',
    description: 'Learn from certified industry professionals and government subject matter experts with decades of experience.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: BookOpen,
    title: '1,500+ Video Courses',
    description: 'Access a massive library of video courses, interactive lessons, and live sessions across all sectors.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    description: 'Course content is continuously updated to reflect the latest policies, regulations, and industry standards.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
];

const TTF_PHASES = [
  {
    phase: 'T',
    title: 'Test',
    description: 'Diagnostic assessments identify knowledge gaps before training begins, ensuring targeted learning paths.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    phase: 'T',
    title: 'Train',
    description: 'Structured, competency-based courses with AI-powered personalization and expert-led content.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    phase: 'F',
    title: 'Fun',
    description: 'Gamified learning with leaderboards, badges, championships, and reward systems to drive engagement.',
    color: 'from-emerald-500 to-emerald-600',
  },
];

const TARGET_CUSTOMERS = [
  { icon: Landmark, title: 'Government Academies', description: 'MDAs, civil service training, policy implementation' },
  { icon: Building2, title: 'Revenue Services', description: 'FIRS, state tax authorities, customs training' },
  { icon: Briefcase, title: 'Corporate Enterprises', description: 'Banks, telecoms, oil & gas, professional services' },
  { icon: GraduationCap, title: 'Educational Institutions', description: 'Universities, polytechnics, vocational schools' },
  { icon: Shield, title: 'Security Agencies', description: 'Compliance, EFCC, ICPC, audit training' },
  { icon: Globe, title: 'NGOs & Development', description: 'International orgs, donor-funded capacity building' },
];

const CAPABILITIES = [
  { icon: Layers, title: 'Multi-Tenant Architecture', description: 'Each organization gets an isolated, branded learning environment.' },
  { icon: Shield, title: 'Role-Based Access Control', description: '5-tier RBAC: Super Admin, Tenant Admin, Facilitator, Admin, Learner.' },
  { icon: Award, title: 'QR-Verified Certificates', description: 'Tamper-proof digital certificates with QR code verification.' },
  { icon: Brain, title: 'AI Quiz Generation', description: 'Gemini-powered quiz generation and adaptive learning paths.' },
  { icon: BarChart3, title: 'Advanced Analytics', description: 'Real-time dashboards, completion rates, ROI reporting.' },
  { icon: Trophy, title: 'Championship System', description: 'Leaderboards, badges, streaks, and enterprise competitions.' },
];

const PRICING_PLANS = [
  {
    name: 'Multi-Tenant SaaS',
    price: '₦50,000',
    period: '/month',
    description: 'Perfect for organizations starting their digital learning journey.',
    features: [
      'Up to 500 learners',
      'Up to 50 courses',
      'Basic analytics dashboard',
      'AI quiz generation (100/month)',
      'QR-verified certificates',
      'Email & chat support',
      'ApexLearn branding',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Full White-Label Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'Complete white-label solution for large organizations with custom requirements.',
    features: [
      'Unlimited learners',
      'Unlimited courses',
      'Full analytics & reporting',
      'Unlimited AI features',
      'Full white-label + custom domain',
      'Custom integrations & API access',
      'Dedicated account manager',
      '99.9% SLA guarantee',
      'On-premise deployment option',
    ],
    cta: 'Request Demo',
    highlighted: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 text-indigo-400 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            AI-Native Learning Infrastructure for Nigeria
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            National{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Learning
            </span>{' '}
            Infrastructure
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The TTF-methodology powered LMS built for Nigerian government agencies, enterprises, and institutions.
            Test. Train. Have Fun. Transform your workforce.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Launch Your Academy <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-[#334155] hover:border-[#475569] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              Request Demo
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: '50+', label: 'Courses Available' },
              { value: '10,000+', label: 'Active Learners' },
              { value: '100+', label: 'Organizations' },
              { value: '95%', label: 'Completion Rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-[#334155] bg-[#1e293b]/50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-slate-500 text-sm mb-6">Trusted by 100+ organizations across Nigeria</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {TRUST_LOGOS.map((logo) => (
              <div key={logo} className="px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-lg text-slate-400 font-semibold text-sm hover:text-white hover:border-indigo-500/50 transition-colors">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose ApexLearn?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to build a world-class learning organization.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 hover:border-indigo-500/40 transition-colors">
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TTF Methodology */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1e293b]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-2 text-violet-400 text-sm font-medium mb-4">
              Our Methodology
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The TTF Methodology</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A proven three-phase approach to transformational learning.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TTF_PHASES.map((phase, i) => (
              <div key={i} className="bg-[#0f172a] border border-[#334155] rounded-2xl p-8 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${phase.color} opacity-10 rounded-bl-full`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white text-2xl font-black mb-6`}>
                  {phase.phase}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{phase.title}</h3>
                <p className="text-slate-400 leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-3xl p-12 text-center">
          <Layers className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built as Infrastructure. Not Just Software.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            ApexLearn is designed from the ground up as national-grade learning infrastructure — 
            scalable, multi-tenant, white-label ready, and AI-powered. Built for Nigeria's workforce transformation.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
            {['99.9% Uptime SLA', 'NDPR Compliant', 'Bank-Grade Security', 'Multi-Cloud Ready'].map((item) => (
              <div key={item} className="flex items-center gap-2 justify-center text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Customers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1e293b]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Who Uses ApexLearn?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Powering learning for diverse sectors across Nigeria.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TARGET_CUSTOMERS.map((customer) => (
              <div key={customer.title} className="bg-[#0f172a] border border-[#334155] rounded-2xl p-6 hover:border-indigo-500/40 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <customer.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{customer.title}</h3>
                  <p className="text-slate-400 text-sm">{customer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Enterprise-Grade Capabilities</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Everything you need at enterprise scale.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6 hover:border-indigo-500/40 transition-colors">
              <cap.icon className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">{cap.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1e293b]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Choose the plan that works for your organization.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border ${plan.highlighted
                  ? 'bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border-indigo-500'
                  : 'bg-[#0f172a] border-[#334155]'}`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-3 py-1 inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-500 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.cta === 'Get Started' ? '/register' : '#contact'}
                  className={`block text-center py-3 rounded-xl font-semibold transition-all ${plan.highlighted
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-white/5 hover:bg-white/10 border border-[#334155] text-white'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Transform Your{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Workforce?
          </span>
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
          Join 100+ organizations already using ApexLearn to upskill their teams and drive measurable results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="inline-flex items-center gap-2 justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25">
            Start Free Trial <ChevronRight className="w-5 h-5" />
          </Link>
          <a href="mailto:hello@apexlearn.ng" className="inline-flex items-center gap-2 justify-center bg-white/5 hover:bg-white/10 border border-[#334155] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all">
            Talk to Sales
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#334155] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">ApexLearn™</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                National Learning Infrastructure for Nigeria's workforce.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-slate-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">NDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#334155] pt-8 text-center text-slate-500 text-sm">
            © 2026 ApexLearn™. All rights reserved. Made in Nigeria 🇳🇬
          </div>
        </div>
      </footer>
    </div>
  );
}
