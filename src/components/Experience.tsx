'use client';

import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import experienceData from '@/data/experience.json';

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
  hidden: { opacity: 0, x: -50 },
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

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Professional Experience
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 to-blue-600"></div>

          {experienceData.map((job, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative mb-12 md:mb-16 ${
                index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-8'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute w-4 h-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full border-4 border-white shadow-lg ${
                index % 2 === 0 
                  ? 'left-2 md:right-0 md:left-auto md:transform md:translate-x-2' 
                  : 'left-2 md:left-0 md:transform md:-translate-x-2'
              } top-6`}></div>

              <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <motion.h3
                        whileHover={{ x: index % 2 === 0 ? -5 : 5 }}
                        className="text-2xl font-bold text-slate-900 mb-2"
                      >
                        {job.title}
                      </motion.h3>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <BuildingOfficeIcon className="w-5 h-5" style={{ color: job.color }} />
                          <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5 text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 mb-4">
                        <CalendarIcon className="w-5 h-5" />
                        <span>
                          {formatDate(job.startDate)} - {formatDate(job.endDate)}
                        </span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full ml-2">
                          {calculateDuration(job.startDate, job.endDate)}
                        </span>
                        {job.current && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full animate-pulse">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed mb-6">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm rounded-full border border-purple-200 hover:from-purple-200 hover:to-blue-200 transition-all duration-300"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}