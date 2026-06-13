import { motion } from 'framer-motion'

function Card({ icon: Icon, title, description, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group glass relative overflow-hidden rounded-2xl p-6 shadow-lg shadow-agri-900/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-agri-600/10 sm:p-8"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-agri-400/10 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 text-white shadow-md shadow-agri-600/25 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-7 w-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </p>

        <div className="mt-5 h-1 w-0 rounded-full bg-gradient-to-r from-agri-500 to-emerald-400 transition-all duration-300 group-hover:w-full" />
      </div>
    </motion.article>
  )
}

export default Card
