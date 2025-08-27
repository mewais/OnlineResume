'use client';

import { motion } from 'framer-motion';
import { LinkIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import publicationsData from '@/data/publications.json';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const typeStyles = {
  journal: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  conference: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  workshop: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  poster: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  thesis: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
};

function getTypeLabel(type: string) {
  const labels = {
    journal: 'Journal Paper',
    conference: 'Conference Paper', 
    workshop: 'Workshop Paper',
    poster: 'Poster',
    thesis: 'Thesis'
  };
  return labels[type as keyof typeof labels] || type;
}

export default function Publications() {
  // Group publications by year
  const publicationsByYear = publicationsData.reduce((acc, pub) => {
    if (!acc[pub.year]) {
      acc[pub.year] = [];
    }
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<number, typeof publicationsData>);

  const years = Object.keys(publicationsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <section id="publications" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Publications
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Research contributions in computer architecture, memory systems, and FPGA acceleration
          </p>
        </motion.div>

        {/* Publication Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 grid grid-cols-2 md:grid-cols-5 gap-6"
        >
          {Object.entries(
            publicationsData.reduce((acc, pub) => {
              acc[pub.type] = (acc[pub.type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([type, count], index) => {
            const styles = typeStyles[type as keyof typeof typeStyles];
            return (
              <motion.div
                key={type}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-4 rounded-xl ${styles?.bg} border ${styles?.border} text-center`}
              >
                <div className={`text-2xl font-bold ${styles?.text} mb-1`}>{count}</div>
                <div className="text-slate-600 text-sm capitalize">{getTypeLabel(type)}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Publications by Year */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {years.map((year) => (
            <div key={year}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center mb-8"
              >
                <h3 className="text-3xl font-bold text-slate-900 mr-4">{year}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-600/50 to-transparent"></div>
              </motion.div>

              <div className="grid grid-cols-1 gap-6">
                {publicationsByYear[parseInt(year)].map((pub, index) => {
                  const styles = typeStyles[pub.type as keyof typeof typeStyles];
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl hover:border-purple-300/30 transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles?.bg} ${styles?.text} border ${styles?.border}`}>
                              {getTypeLabel(pub.type)}
                            </span>
                            <span className="text-slate-500 text-sm">{pub.year}</span>
                          </div>

                          <h4 className="text-xl font-bold text-slate-900 mb-3 leading-tight hover:text-purple-700 transition-colors duration-300">
                            {pub.title}
                          </h4>

                          <p className="text-slate-600 mb-3 leading-relaxed">
                            {pub.authors.map((author, i) => (
                              <span key={i} className={author.includes('Mohammad Ewais') ? 'font-semibold text-purple-700' : ''}>
                                {author}
                                {i < pub.authors.length - 1 && ', '}
                              </span>
                            ))}
                          </p>

                          <p className="text-slate-500 italic mb-4">
                            {pub.venue}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {pub.link && (
                              <motion.a
                                href={pub.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 text-sm font-medium"
                              >
                                <LinkIcon className="w-4 h-4" />
                                Paper
                              </motion.a>
                            )}
                            {pub.slides && (
                              <motion.a
                                href={pub.slides}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-300 text-sm font-medium"
                              >
                                <PresentationChartLineIcon className="w-4 h-4" />
                                Slides
                              </motion.a>
                            )}
                          </div>
                        </div>

                        <div className="lg:w-32 flex lg:flex-col items-center lg:items-end gap-2">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: pub.color }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Research Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl p-8 border border-purple-200/30">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Research Impact</h3>
            <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
              My research spans computer architecture, memory systems, cache compression, FPGA acceleration, 
              and datacenter disaggregation. I focus on practical solutions that bridge the gap between 
              theoretical research and real-world applications in high-performance computing.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}