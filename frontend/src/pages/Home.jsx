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
    <div className="flex min-h-screen flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Hero />

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-agri-600">
                Features
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl lg:text-4xl">
                Everything you need to farm smarter
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                Our platform combines cutting-edge AI with agricultural expertise
                to deliver tools that help you grow healthier crops and higher yields.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
