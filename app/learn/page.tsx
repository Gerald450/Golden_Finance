"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Link from "next/link";

const lessons = [
  { 
    id:"save", 
    title:"How to Save Money", 
    subtitle:"Build your financial foundation with smart saving habits.",
    description:"Master the fundamentals of saving to secure your financial future.",
    color:"from-green-500 to-green-400",
    bgGradient:"from-green-500/20 to-green-400/5",
    borderColor:"border-green-400/20",
    textColor:"text-green-400",
    icon:"💰",
    bullets:["Pay yourself first (10%)","Automate transfers","Cut 1 recurring expense"]
  },
  { 
    id:"budget", 
    title:"Budgeting Basics", 
    subtitle:"Take control of your money with effective budgeting.",
    description:"Learn essential budgeting strategies to manage your finances effectively.",
    color:"from-pink-500 to-pink-400",
    bgGradient:"from-pink-500/20 to-pink-400/5",
    borderColor:"border-pink-400/20",
    textColor:"text-pink-400",
    icon:"📈",
    bullets:["50/30/20 rule","Track 3 categories","Weekly 10-min review"]
  },
  { 
    id:"invest", 
    title:"Intro to Investing", 
    subtitle:"Start your investment journey with confidence.",
    description:"Understand the basics of investing to grow your wealth over time.",
    color:"from-purple-500 to-purple-400",
    bgGradient:"from-purple-500/20 to-purple-400/5",
    borderColor:"border-purple-400/20",
    textColor:"text-purple-400",
    icon:"🎯",
    bullets:["Compound growth","Index funds concept","Risk vs reward"]
  },
];

export default function Learn() {
  const [completed, setCompleted] = useState<string[]>([]);
  
  const markComplete = (lessonId: string) => {
    if (!completed.includes(lessonId)) {
      setCompleted(prev => [...prev, lessonId]);
    }
  };

  const completionPercentage = (completed.length / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#00111a] to-black text-white">
      <Navigation />
      
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse absolute w-80 h-80 bg-[#00e3b3]/10 blur-3xl rounded-full top-[15%] right-[20%]" />
        <div className="animate-pulse absolute w-96 h-96 bg-yellow-400/5 blur-3xl rounded-full bottom-[25%] left-[15%]" />
      </div>

      <main className="relative z-10 pt-24 p-6 space-y-12 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-[#00e3b3]">Financial </span>{" "}
            <span className="text-yellow-400">Training</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Master essential financial skills with our Financial Training program.
          </p>
          
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Your Progress</span>
              <span>{completed.length}/{lessons.length} completed</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-[#00e3b3] to-yellow-400 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="text-center mt-2 text-sm text-[#00e3b3]">
              {Math.round(completionPercentage)}% Complete
            </div>
          </motion.div>
        </motion.div>

        {/* Lesson Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {lessons.map((lesson, index) => {
            const isCompleted = completed.includes(lesson.id);
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                className={`
                  relative overflow-hidden rounded-3xl p-8 h-[500px] cursor-pointer group
                  bg-gradient-to-br ${lesson.bgGradient} 
                  border ${lesson.borderColor} backdrop-blur-sm
                  ${isCompleted ? 'ring-2 ring-[#00e3b3] ring-opacity-50' : ''}
                `}
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-[#00e3b3] rounded-full flex items-center justify-center text-black font-bold text-sm"
                  >
                    ✓
                  </motion.div>
                )}

                {/* Background Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${lesson.color} opacity-20 rounded-full blur-2xl`} />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-200">
                    {lesson.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold ${lesson.textColor} mb-3`}>
                    {lesson.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
                    {lesson.description}
                  </p>

                  {/* Key Points */}
                  <div className="space-y-2 mb-6">
                    {lesson.bullets.map((bullet, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.2 + idx * 0.1 }}
                        className="flex items-center space-x-2 text-xs text-gray-400"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${lesson.color}`} />
                        <span>{bullet}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => markComplete(lesson.id)}
                    disabled={isCompleted}
                    whileHover={{ scale: isCompleted ? 1 : 1.05 }}
                    whileTap={{ scale: isCompleted ? 1 : 0.95 }}
                    className={`
                      w-full py-3 px-6 rounded-2xl font-semibold text-sm transition-all duration-200
                      ${isCompleted 
                        ? 'bg-[#00e3b3] text-black cursor-default' 
                        : `bg-gradient-to-r ${lesson.color} text-white hover:shadow-lg hover:shadow-${lesson.color.split('-')[1]}-500/25`
                      }
                    `}
                  >
                    {isCompleted ? 'Completed ✓' : 'Mark Complete'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center py-12"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-8 max-w-2xl mx-auto">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#00e3b3]/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#00e3b3] mb-4">
                Ready to Put Your Knowledge to Work?
              </h3>
              <p className="text-gray-300 mb-6">
                Start investing in your community and see your impact grow
              </p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/invest"
                  className="px-6 py-3 bg-[#00e3b3] text-black font-semibold rounded-lg hover:bg-[#00e3b3]/90 transition"
                >
                  Start Investing
                </Link>
                <Link 
                  href="/dashboard"
                  className="px-6 py-3 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
