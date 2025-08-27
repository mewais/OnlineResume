'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  GlobeAltIcon, 
  EyeIcon, 
  MapPinIcon,
  ArrowTrendingUpIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const VisitorMap = dynamic(() => import('@/components/VisitorMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-100 rounded-xl flex items-center justify-center">
      <div className="text-slate-500">Loading map...</div>
    </div>
  )
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface VisitorData {
  id: string;
  country: string;
  state: string;
  city: string;
  postal: string;
  longitude: number;
  latitude: number;
  visits: number;
}

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  countries: number;
  visitsByDate: { [date: string]: number };
  visitors: VisitorData[];
}

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

export default function VisitorsPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/visitors');
        if (!response.ok) {
          throw new Error('Failed to fetch visitor data');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Analytics</h1>
          <p className="text-slate-300">
            {error || 'Database not configured or visitor tracking disabled'}
          </p>
          <p className="text-slate-400 mt-2 text-sm">
            Configure DATABASE_HOSTNAME, DATABASE_USERNAME, DATABASE_PASSWORD, and DATABASE_SCHEMA environment variables.
          </p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartDates = Object.keys(stats.visitsByDate).sort();
  const chartData = {
    labels: chartDates,
    datasets: [
      {
        label: 'Daily Visits',
        data: chartDates.map(date => stats.visitsByDate[date]),
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Visits Over Time',
        color: 'white'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  // Prepare table data
  const tableData = stats.visitors.map(visitor => ({
    ...visitor,
    dateTime: visitor.id.split('-')[1] || 'Unknown',
    location: [visitor.city, visitor.state, visitor.country]
      .filter(item => item && item !== 'Not found')
      .join(', ') || 'Unknown'
  })).sort((a, b) => b.visits - a.visits);

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

      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Visitor Analytics
            </motion.h1>
            <motion.p 
              className="text-slate-300 text-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Real-time insights into website visitors and engagement
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12"
          >
            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <EyeIcon className="w-8 h-8 text-purple-400" />
                <motion.span 
                  className="text-2xl font-bold text-purple-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {stats.totalVisits}
                </motion.span>
              </div>
              <h3 className="text-slate-300">Total Visits</h3>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <UsersIcon className="w-8 h-8 text-blue-400" />
                <motion.span 
                  className="text-2xl font-bold text-blue-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {stats.uniqueVisitors}
                </motion.span>
              </div>
              <h3 className="text-slate-300">Unique Visitors</h3>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <GlobeAltIcon className="w-8 h-8 text-green-400" />
                <motion.span 
                  className="text-2xl font-bold text-green-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  {stats.countries}
                </motion.span>
              </div>
              <h3 className="text-slate-300">Countries</h3>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <ArrowTrendingUpIcon className="w-8 h-8 text-pink-400" />
                <motion.span 
                  className="text-2xl font-bold text-pink-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  {chartDates.length}
                </motion.span>
              </div>
              <h3 className="text-slate-300">Active Days</h3>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <ClockIcon className="w-6 h-6 text-purple-400 mr-2" />
                Visit Timeline
              </h3>
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MapPinIcon className="w-6 h-6 text-blue-400 mr-2" />
                Visitor Locations
              </h3>
              <VisitorMap visitors={stats.visitors} />
            </motion.div>
          </div>

          {/* Visitors Table */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
          >
            <h3 className="text-xl font-bold mb-4">Visitor Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="pb-3 text-slate-300">Date & Time</th>
                    <th className="pb-3 text-slate-300">Location</th>
                    <th className="pb-3 text-slate-300">Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(0, 20).map((visitor, index) => (
                    <motion.tr
                      key={visitor.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <td className="py-3 text-slate-300">{visitor.dateTime}</td>
                      <td className="py-3 text-slate-300">{visitor.location}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                          {visitor.visits}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}