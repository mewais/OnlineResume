'use client';

import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import educationData from '@/data/education.json';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 }
  }
};

function formatDate(dateString: string) {
  if (dateString === 'present') return 'Present';
  const [year, month] = dateString.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function calculateDuration(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = endDate === 'present' ? new Date() : new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
  }
}

export default function Education() {
  return (
    <section id="education" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Education
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Academic journey through computer engineering and research
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-blue-400"></div>

          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative mb-12 md:mb-16 ${
                index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-8'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute w-4 h-4 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full border-4 border-slate-900 shadow-lg ${
                index % 2 === 0 
                  ? 'left-2 md:right-0 md:left-auto md:transform md:translate-x-2' 
                  : 'left-2 md:left-0 md:transform md:-translate-x-2'
              } top-6`}></div>

              <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col gap-4 mb-4">
                    <motion.h3
                      whileHover={{ x: index % 2 === 0 ? -5 : 5 }}
                      className="text-2xl font-bold mb-2"
                    >
                      {edu.degree}
                    </motion.h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-300 mb-4">
                      <div className="flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5" style={{ color: edu.color }} />
                        <span className="font-medium">{edu.institution}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-slate-400" />
                        <span>{edu.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                      <CalendarIcon className="w-5 h-5" />
                      <span>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                      <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full ml-2">
                        {calculateDuration(edu.startDate, edu.endDate)}
                      </span>
                      {edu.current && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full animate-pulse">
                          Ongoing
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {edu.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Academic Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-4xl font-bold text-purple-400 mb-2"
            >
              15+
            </motion.div>
            <div className="text-slate-300">Years of Study</div>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-4xl font-bold text-blue-400 mb-2"
            >
              3
            </motion.div>
            <div className="text-slate-300">Degrees</div>
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-4xl font-bold text-pink-400 mb-2"
            >
              9+
            </motion.div>
            <div className="text-slate-300">Publications</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}