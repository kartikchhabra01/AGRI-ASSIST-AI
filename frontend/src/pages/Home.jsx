import { motion } from 'framer-motion'
import { Bot, Bug, LineChart } from 'lucide-react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Card from '../components/Card'
import Footer from '../components/Footer'

const features = [
  {
    icon: Bot,
    title: 'AI Crop Advisory',
    description:
      'Get instant, context-aware recommendations on crop management, pest control, and nutrient planning powered by advanced AI models.',
  },
  {
    icon: Bug,
    title: 'Disease Detection',
    description:
      'Identify crop diseases early with intelligent image analysis and receive actionable treatment plans to protect your harvest.',
  },
  {
    icon: LineChart,
    title: 'Smart Farming Insights',
    description:
      'Access data-driven analytics on soil health, weather patterns, and yield forecasts to make informed farming decisions.',
  },
]

function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />

        <section className="px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-14 max-w-2xl text-center"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-agri-600">
                Features
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to farm smarter
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Our platform combines cutting-edge AI with agricultural expertise
                to deliver tools that help you grow healthier crops and higher yields.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
