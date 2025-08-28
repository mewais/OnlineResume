'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  AcademicCapIcon,
  BuildingOfficeIcon,
  UserIcon,
  CodeBracketIcon,
  LinkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PauseCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import projectsData from '@/data/projects.json';

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const statusIcons = {
  'Ongoing': ClockIcon,
  'Finished': CheckCircleIcon,
  'Maintained': CheckCircleIcon,
  'Abandoned': ExclamationTriangleIcon,
  'On Hold/Busy': PauseCircleIcon,
};

const typeIcons = {
  'Industry': BuildingOfficeIcon,
  'Research': AcademicCapIcon,
  'Personal': UserIcon,
  'Open Source': CodeBracketIcon,
  'Web Development': CodeBracketIcon,
  'Mobile Development': CodeBracketIcon,
  'Academic': AcademicCapIcon,
};

const filterOptions = ['All', 'Industry', 'Research', 'Personal', 'Open Source', 'Web Development', 'Mobile Development', 'Academic'];
const statusFilters = ['All', 'Ongoing', 'Finished', 'Maintained', 'Abandoned', 'On Hold/Busy'];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const filteredProjects = projectsData.filter(project => {
    const typeMatch = activeFilter === 'All' || project.type === activeFilter;
    const statusMatch = activeStatusFilter === 'All' || project.status === activeStatusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Research & Projects
              </motion.h1>
              <motion.p 
                className="text-slate-300 text-lg max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                A comprehensive overview of my research contributions, professional projects, and personal initiatives spanning computer architecture, machine learning, and software development.
              </motion.p>

              {/* Back to Home Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8"
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium"
                >
                  ← Back to Home
                </Link>
              </motion.div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                <div className="text-sm text-slate-400 mr-2">Filter by Type:</div>
                {filterOptions.map((filter) => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilter === filter
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="text-sm text-slate-400 mr-2">Filter by Status:</div>
                {statusFilters.map((filter) => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveStatusFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeStatusFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {filteredProjects.map((project, index) => {
              const StatusIcon = statusIcons[project.status as keyof typeof statusIcons];
              const TypeIcon = typeIcons[project.type as keyof typeof typeIcons];
              const isExpanded = expandedProject === project.id;

              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <TypeIcon className="w-6 h-6" style={{ color: project.color }} />
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-slate-300 font-medium">{project.organization}</span>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" style={{ color: project.statusColor }} />
                          <span 
                            className="px-2 py-1 text-xs rounded-full font-medium"
                            style={{ 
                              backgroundColor: `${project.statusColor}20`, 
                              color: project.statusColor 
                            }}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-gradient-to-r from-purple-100/10 to-blue-100/10 text-purple-300 text-sm rounded-full border border-purple-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expand/Collapse Details */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                    className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-300 text-slate-300 font-medium mb-4"
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </motion.button>

                  {/* Expanded Details */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {isExpanded && (
                      <div className="space-y-4">
                        {project.details && (
                          <div>
                            <h4 className="text-lg font-semibold text-purple-400 mb-2">Project Details</h4>
                            <ul className="space-y-2">
                              {project.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {project.currentWork && (
                          <div>
                            <h4 className="text-lg font-semibold text-blue-400 mb-2">Current Work</h4>
                            <ul className="space-y-2">
                              {project.currentWork.map((work, workIndex) => (
                                <li key={workIndex} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                  {work}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {project.futureWork && (
                          <div>
                            <h4 className="text-lg font-semibold text-yellow-400 mb-2">Future Work</h4>
                            <ul className="space-y-2">
                              {project.futureWork.map((work, workIndex) => (
                                <li key={workIndex} className="text-slate-300 text-sm flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                                  {work}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Links */}
                  {project.links && project.links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.links.map((link, linkIndex) => (
                        <motion.a
                          key={linkIndex}
                          href={link.url}
                          target={link.url.startsWith('http') ? "_blank" : "_self"}
                          rel={link.url.startsWith('http') ? "noopener noreferrer" : undefined}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-all duration-300 text-sm"
                        >
                          <LinkIcon className="w-4 h-4" />
                          {link.title}
                          {link.note && (
                            <span className="text-xs text-purple-400">({link.note})</span>
                          )}
                        </motion.a>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* No Results Message */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <div className="text-slate-400 text-lg">
                No projects found matching the selected filters.
              </div>
            </motion.div>
          )}

          {/* Project Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl p-8 border border-purple-200/20">
              <h3 className="text-2xl font-bold text-white mb-4">Project Portfolio Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{projectsData.length}</div>
                  <div className="text-slate-300">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {projectsData.filter(p => p.status === 'Finished' || p.status === 'Maintained').length}
                  </div>
                  <div className="text-slate-300">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {projectsData.filter(p => p.status === 'Ongoing').length}
                  </div>
                  <div className="text-slate-300">Ongoing</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {[...new Set(projectsData.map(p => p.type))].length}
                  </div>
                  <div className="text-slate-300">Categories</div>
                </div>
              </div>
              <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                My research and development portfolio spans industry and academia, covering computer architecture, 
                memory systems, GPU computing, FPGA acceleration, compiler development, and web technologies. 
                Each project represents a commitment to pushing the boundaries of technology and contributing 
                to both theoretical knowledge and practical applications.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}