import { motion } from 'framer-motion'
import { Target, Users, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    text: 'To democratize access to expert agricultural knowledge through AI, helping every farmer make better decisions.',
  },
  {
    icon: Users,
    title: 'Who We Serve',
    text: 'Farmers, field supervisors, and agricultural students seeking reliable, instant guidance on crop health and farming practices.',
  },
  {
    icon: Zap,
    title: 'Our Approach',
    text: 'We combine Google Gemini AI with domain-specific agricultural data to deliver accurate, actionable recommendations.',
  },
]

function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-agri-600">
              About Us
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              About AGRI ASSIST AI
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass mt-10 rounded-3xl p-8 shadow-lg shadow-agri-900/5 sm:p-10"
          >
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              AGRI ASSIST AI is an AI-powered crop advisory platform built as part of
              the SIP 2026 Summer Internship Programme. It helps farmers and field
              supervisors get instant guidance on crop diseases, pest management,
              nutrient deficiencies, and best farming practices through an intuitive
              chat interface.
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              By leveraging Google&apos;s Gemini API, the platform generates
              context-aware recommendations while encouraging users to verify
              critical advice with certified agricultural experts. Our goal is to
              bridge the knowledge gap in agriculture and empower rural communities
              with technology that is accessible, reliable, and easy to use.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="glass rounded-2xl p-6 text-center shadow-md shadow-agri-900/5"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default About
