import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Bell, Users, Share2, GithubIcon, MessageSquare, Search } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const howItWorks = [
    {
      number: "1",
      title: "Real-Time Task Updates",
      description: "Get instant notifications and reminders for tasks, deadlines, and milestones"
    },
    {
      number: "2",
      title: "Smart Task Delegation",
      description: "Assign tasks easily with natural language commands like, 'Assign task to John by Monday'"
    },
    {
      number: "3",
      title: "Seamless Integrations",
      description: "Connect with tools like Slack, Github, or Google Drive for smooth workflows"
    }
  ];

  const chatbotFeatures = [
    {
      icon: <Bell className="w-6 h-6 text-blue-500" />,
      title: "Real-Time Task Updates",
      description: "Get instant notifications and reminders for tasks, deadlines, and milestones"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      title: "Smart Task Delegation",
      description: "Assign tasks easily with natural language commands like, 'Assign task to John by Monday'"
    },
    {
      icon: <Share2 className="w-6 h-6 text-blue-500" />,
      title: "Seamless Integrations",
      description: "Connect with tools like Slack, Github, or Google Drive for smooth workflows"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1c2e] via-[#2d1b4e] to-[#1a1c2e]">
      {/* Navigation */}
      <nav className="fixed w-full bg-[#1a1c2e]/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">StableCoupons</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800/50 text-white pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Feature</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">ChatBot</a>
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-all"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20">
        <motion.div 
          className="container mx-auto px-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Streamline Your Project Management with Smart AI
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Collaborate, manage tasks, and meet deadlines effortlessly with our AI-powered
            chatbot designed for professionals and teams.
          </motion.p>
          <motion.div 
            className="flex justify-center space-x-4"
            variants={itemVariants}
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transform hover:scale-105 transition-all"
            >
              Get Started
            </button>
            <button 
              className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transform hover:scale-105 transition-all"
            >
              Explore Features
            </button>
          </motion.div>
        </motion.div>

        {/* Chat Preview */}
        <motion.div 
          className="container mx-auto px-6 mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-[#2d1b4e]/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex space-x-2 mb-4">
              <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Project Manager</div>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" alt="" className="w-8 h-8 rounded-full" />
            </div>
            <div className="flex space-x-2 mb-4">
              <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm">Task</div>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=faces" alt="" className="w-8 h-8 rounded-full" />
            </div>
            <div className="flex space-x-2">
              <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm">Designer</div>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=faces" alt="" className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 transform hover:scale-105 transition-all shadow-xl"
                variants={itemVariants}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mb-6">
                  {item.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Chatbot Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {chatbotFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8"
                variants={itemVariants}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white rounded-xl p-8"
              variants={itemVariants}
            >
              <Users className="w-6 h-6 text-blue-500 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Assistance</h3>
              <p className="text-gray-600">Get tailored suggestions based on your team's history</p>
            </motion.div>
            <motion.div
              className="bg-white rounded-xl p-8"
              variants={itemVariants}
            >
              <Share2 className="w-6 h-6 text-blue-500 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">File Sharing & Collaboration</h3>
              <p className="text-gray-600">Share files directly in chat for real-time teamwork</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="bg-white rounded-2xl p-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-4 text-center"
              variants={itemVariants}
            >
              Integrate with your favorite apps
            </motion.h2>
            <motion.p
              className="text-gray-600 text-center mb-12"
              variants={itemVariants}
            >
              "Integrating seamlessly with Slack, Drive, and GitHub for better collaboration."
            </motion.p>
            <motion.div 
              className="flex justify-center items-center space-x-12"
              variants={itemVariants}
            >
              <GithubIcon className="w-12 h-12 text-gray-900" />
              <img src="https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png" alt="Google Drive" className="h-12" />
              <img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="Slack" className="h-12" />
              <img src="https://a.slack-edge.com/80588/img/slack_api_logo_vogue.png" alt="Slack API" className="h-12" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;