'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import skillsData from '@/data/skills.json';

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
    transition: { duration: 0.5 }
  }
};

interface SkillBarProps {
  name: string;
  level: number;
  delay: number;
}

function SkillBar({ name, level, delay }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-700 font-medium">{name}</span>
        <span className="text-slate-500 text-sm">{level}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full relative"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface NestedSkillsProps {
  skills: any;
  depth: number;
  delay: number;
}

function NestedSkills({ skills, depth = 0, delay }: NestedSkillsProps) {
  let currentDelay = delay;
  
  return (
    <>
      {Object.entries(skills).map(([key, value]) => {
        if (typeof value === 'number') {
          const skillBar = <SkillBar key={key} name={key} level={value} delay={currentDelay} />;
          currentDelay += 0.1;
          return skillBar;
        } else if (typeof value === 'object') {
          const nestedComponent = (
            <div key={key} className={`${depth > 0 ? 'ml-4 border-l-2 border-slate-200 pl-4' : ''} mb-6`}>
              <motion.h4
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: currentDelay }}
                className={`${depth === 0 ? 'text-lg' : 'text-md'} font-semibold text-slate-800 mb-4 ${
                  depth === 0 ? 'text-purple-700' : 'text-slate-700'
                }`}
              >
                {key}
              </motion.h4>
              <NestedSkills skills={value} depth={depth + 1} delay={currentDelay + 0.1} />
            </div>
          );
          currentDelay += Object.keys(value).length * 0.1 + 0.2;
          return nestedComponent;
        }
        return null;
      })}
    </>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('Programming');
  const categories = Object.keys(skillsData);

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            A comprehensive overview of my technical skills and expertise across various domains
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <div className="w-3 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></div>
              {activeCategory}
            </h3>
            
            <NestedSkills 
              skills={skillsData[activeCategory as keyof typeof skillsData]} 
              depth={0} 
              delay={0.3}
            />
          </motion.div>

          {/* Skills Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Skills Overview</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {categories.map((category, index) => {
                const categorySkills = skillsData[category as keyof typeof skillsData];
                
                // Calculate average skill level for the category
                const flattenSkills = (obj: any): number[] => {
                  const values: number[] = [];
                  Object.values(obj).forEach(value => {
                    if (typeof value === 'number') {
                      values.push(value);
                    } else if (typeof value === 'object') {
                      values.push(...flattenSkills(value));
                    }
                  });
                  return values;
                };
                
                const skillLevels = flattenSkills(categorySkills);
                const averageLevel = skillLevels.length > 0 
                  ? Math.round(skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length)
                  : 0;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      activeCategory === category
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-slate-200 bg-slate-50 hover:border-purple-200'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    <h4 className="font-semibold text-slate-800 mb-2 text-sm">{category}</h4>
                    <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${averageLevel}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-slate-500 mt-1 block">{averageLevel}% avg</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}