import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Bot, Code, Cpu, Layers, ShoppingBag, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-32 pb-20">

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="neu-panel p-12 md:p-20 relative overflow-hidden">


            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Designing Intelligent <br />
              <span className="text-accent">Web Systems</span> for <br />
              Modern Commerce
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              We build scalable digital platforms, specializing in high-performance TCG ecommerce and AI-powered automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  Build With Aethod
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Our Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <Card className="hover:translate-y-[-4px] transition-transform duration-300">
            <div className="h-12 w-12 rounded-2xl bg-gray-200 flex items-center justify-center mb-6 neu-pressed text-accent">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-3">TCG Ecommerce</h3>
            <p className="text-gray-600 mb-6">
              High-performance online stores tailored for trading card businesses.
              Advanced inventory management and fast filtering.
            </p>
          </Card>

          <Card className="hover:translate-y-[-4px] transition-transform duration-300">
            <div className="h-12 w-12 rounded-2xl bg-gray-200 flex items-center justify-center mb-6 neu-pressed text-accent">
              <Code size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Custom Development</h3>
            <p className="text-gray-600 mb-6">
              Scalable, clean, and future-ready platforms. From dashboards to
              complex internal tools built with Next.js.
            </p>
          </Card>

          <Card className="hover:translate-y-[-4px] transition-transform duration-300">
            <div className="h-12 w-12 rounded-2xl bg-gray-200 flex items-center justify-center mb-6 neu-pressed text-accent">
              <Bot size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI Agents</h3>
            <p className="text-gray-600 mb-6">
              Smart assistants designed to automate business workflows.
              Customer support, data entry, and more.
            </p>
          </Card>

          <Card className="hover:translate-y-[-4px] transition-transform duration-300">
            <div className="h-12 w-12 rounded-2xl bg-gray-200 flex items-center justify-center mb-6 neu-pressed text-accent">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-3">AI Automation</h3>
            <p className="text-gray-600 mb-6">
              Reduce manual work with intelligent systems that sync data
              and optimize operations automatically.
            </p>
          </Card>

        </div>
      </section>

      {/* Featured Focus: TCG */}
      <section className="container mx-auto px-4">
        <div className="neu-panel p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent">
              Featured Industry
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">TCG Business Solutions</h2>
            <p className="text-gray-600 text-lg">
              Trading Card Game ecommerce is complex. We solve the headache of
              managing thousands of variants, condition grading, and live market pricing.
            </p>
            <ul className="space-y-3">
              {[
                "Bulk Inventory Management",
                "Advanced Card Filtering",
                "Price Syncing",
                "Buy-list Systems"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link href="/industry/tcg">
                <Button>Learn More about TCG</Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            {/* Visual Placeholder for UI */}
            <div className="neu-input p-6 rounded-3xl min-h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Layers size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-mono text-sm">TCG Dashboard UI Mockup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Aethod */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Aethod?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We don't just write code. We build systems that grow with your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "System-First", desc: "We architect correctly from day one." },
            { title: "Clean Code", desc: "Maintainable, type-safe, and robust." },
            { title: "AI-Ready", desc: "Built to integrate with future AI tools." }
          ].map((item, i) => (
            <div key={i} className="text-center p-6">
              <div className="h-16 w-16 mx-auto rounded-full neu-panel flex items-center justify-center mb-6 text-accent font-bold text-2xl">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="neu-panel p-12 md:p-24 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Let's design your next system.</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Ready to upgrade your digital presence? We are currently accepting new projects.
          </p>
          <Link href="/contact">
            <Button size="lg" className="px-12 h-16 text-lg">
              Start a Project <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
