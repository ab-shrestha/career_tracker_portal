import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  FileSpreadsheet, 
  CheckSquare, 
  Target, 
  Users, 
  BookOpen,
  Rocket,
  LayoutDashboard,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: <FileSpreadsheet className="h-6 w-6 text-blue-500" />,
    title: "Application Tracker",
    subtitle: "Organize and monitor progress",
    description: "Keep track of every job application in one place from initial submission to offer.",
    link: "/applications",
    borderColor: "border-t-blue-500",
    buttonText: "Start Tracking",
    buttonClass: "text-blue-600",
    bgColor: "bg-white"
  },
  {
    icon: <CheckSquare className="h-6 w-6 text-green-500" />,
    title: "Task Management",
    subtitle: "Prioritize job search activities",
    description: "Set reminders for interviews, deadlines, and follow-ups to stay on track.",
    link: "/tasks",
    borderColor: "border-t-green-500",
    buttonText: "To-do List",
    buttonClass: "text-green-600",
    bgColor: "bg-white"
  },
  {
    icon: <Target className="h-6 w-6 text-purple-500" />,
    title: "Target Companies",
    subtitle: "Score and prioritize companies",
    description: "Create a focused list to target your search effectively.",
    link: "/target-companies",
    borderColor: "border-t-purple-500",
    buttonText: "LAMPSV List",
    buttonClass: "text-purple-600",
    bgColor: "bg-white"
  },
  {
    icon: <Users className="h-6 w-6 text-orange-500" />,
    title: "Networking Tracker",
    subtitle: "Build and nurture professional relationships",
    description: "Keep track of contacts, conversations, and follow-ups to strengthen your professional network.",
    link: "/networking",
    borderColor: "border-t-orange-500",
    buttonText: "Manage Contacts",
    buttonClass: "text-orange-600",
    bgColor: "bg-orange-50/40"
  },
  {
    icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
    title: "Reflection Journal",
    subtitle: "Define your strengths and craft your story",
    description: "Document your career journey and develop a compelling professional narrative that resonates.",
    link: "/reflection-journal",
    borderColor: "border-t-indigo-500",
    buttonText: "Open Journal",
    buttonClass: "text-indigo-600",
    bgColor: "bg-indigo-50/40"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
              Your Career Journey, Organized
            </div>
            
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-800 to-purple-700 bg-clip-text text-transparent mb-4">
                Career Tracker
              </h1>
              <p className="text-xl text-gray-600">
                Plan, organize, and track your job search with data-driven insights all in one beautifully designed workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-gray-300">
                <Link to="/applications">
                  <FileSpreadsheet className="mr-2 h-5 w-5" />
                  Track Applications
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:block relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-200/50 via-blue-100/30 to-green-100/50 rounded-[2rem] blur-2xl opacity-90" />
            <div className="absolute -inset-4 bg-gradient-to-br from-purple-100/80 to-blue-100/40 rounded-[2rem] blur-xl opacity-70" />
            <Card className="w-full max-w-[320px] mx-auto shadow-md relative bg-white rounded-xl backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFD93D]" />
                  <div className="w-2 h-2 rounded-full bg-[#6BCB77]" />
                </div>
                <span className="text-sm text-gray-600">Career Tracker</span>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                <div className="bg-gray-50/70 rounded-lg p-3">
                  <h3 className="text-sm mb-2.5 text-gray-800">Applications Overview</h3>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-blue-100/80 text-blue-700 rounded-lg text-xs">
                      Applied: 25
                    </span>
                    <span className="px-2.5 py-1 bg-purple-100/80 text-purple-700 rounded-lg text-xs">
                      Interviews: 12
                    </span>
                    <span className="px-2.5 py-1 bg-green-100/80 text-green-700 rounded-lg text-xs">
                      Offers: 3
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50/70 rounded-lg p-3">
                  <h3 className="text-sm mb-2.5 text-gray-800">Upcoming Tasks</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Interview Preparation</span>
                      <span className="text-red-500 text-xs">Today</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 text-sm">Follow-up Email</span>
                      <span className="text-orange-500 text-xs">Tomorrow</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-24">
          <h2 className="text-3xl font-bold mb-4">Everything you need to manage your career growth</h2>
          <p className="text-xl text-gray-600 mb-16">
            Powerful tools to help you stay organized, track progress, and land your dream job
          </p>

          <div className="grid grid-cols-1 gap-8">
            {/* Top row - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.slice(0, 3).map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className="block group"
                >
                  <div className={`h-full ${feature.bgColor} rounded-xl shadow-sm transition-all duration-200 border-t-4 ${feature.borderColor} hover:shadow-md`}>
                    <div className="p-8 flex flex-col h-full text-left">
                      <div className="mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{feature.subtitle}</p>
                      <p className="text-sm text-gray-600 mb-6 flex-grow">{feature.description}</p>
                      <div className={`inline-flex items-center text-sm font-medium ${feature.buttonClass} group-hover:gap-1.5 gap-1 transition-all`}>
                        {feature.buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom row - 2 wider cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.slice(3).map((feature) => (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className="block group"
                >
                  <div className={`h-full ${feature.bgColor} rounded-xl shadow-sm transition-all duration-200 border-t-4 ${feature.borderColor} hover:shadow-md backdrop-blur-sm`}>
                    <div className="p-8 flex flex-col h-full text-left">
                      <div className="mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{feature.subtitle}</p>
                      <p className="text-sm text-gray-600 mb-6 flex-grow">{feature.description}</p>
                      <div className={`inline-flex items-center text-sm font-medium ${feature.buttonClass} group-hover:gap-1.5 gap-1 transition-all`}>
                        {feature.buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
            <div className="space-y-4 mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <Rocket className="h-6 w-6" />
                <h3 className="text-2xl font-bold">Ready to supercharge your job search?</h3>
              </div>
              <p className="text-white/90">
                Track your progress, gain insights, and land your dream job faster with our powerful tools.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          © 2025 Career Tracker Portal. AB Shrestha. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
