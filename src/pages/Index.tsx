import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileSpreadsheet, CheckSquare, Users, Book, Target, Sparkles, BarChart } from "lucide-react";

const features = [
  {
    icon: <FileSpreadsheet className="h-8 w-8 text-purple-500" />,
    title: "Track Applications",
    description: "Keep all your job applications organized in one place with statuses and notes.",
    color: "from-purple-50 to-purple-100/50"
  },
  {
    icon: <CheckSquare className="h-8 w-8 text-blue-500" />,
    title: "Manage Tasks",
    description: "Never miss a follow-up or deadline with our task management system.",
    color: "from-blue-50 to-blue-100/50"
  },
  {
    icon: <Users className="h-8 w-8 text-green-500" />,
    title: "Network Effectively",
    description: "Build and maintain your professional network to uncover hidden opportunities.",
    color: "from-green-50 to-green-100/50"
  },
  {
    icon: <Target className="h-8 w-8 text-orange-500" />,
    title: "Target Companies",
    description: "Identify and track your dream companies with our scoring system.",
    color: "from-orange-50 to-orange-100/50"
  },
  {
    icon: <Book className="h-8 w-8 text-pink-500" />,
    title: "Reflection Journal",
    description: "Document your career journey and track your personal growth.",
    color: "from-pink-50 to-pink-100/50"
  },
  {
    icon: <BarChart className="h-8 w-8 text-indigo-500" />,
    title: "Analytics Dashboard",
    description: "Visualize your job search progress with detailed analytics.",
    color: "from-indigo-50 to-indigo-100/50"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            JobTrackr
          </h1>
        </div>
        <div>
          <Button asChild variant="outline">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="py-16 flex flex-col items-center text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Career Journey,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Organized
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Streamline your job search with our all-in-one platform. Track applications, manage tasks, 
              build your network, and reflect on your career goals—all in one place.
            </p>
            <div className="mt-10 flex gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <section className="py-16" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`bg-gradient-to-br ${feature.color} p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="mb-4" aria-hidden="true">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl" aria-labelledby="cta-heading">
          <div className="text-center max-w-3xl mx-auto">
            <h2 id="cta-heading" className="text-3xl font-bold mb-4">Ready to Transform Your Job Search?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of professionals who have streamlined their job search process with JobTrackr.
            </p>
            <Button 
              asChild
              size="lg" 
              className="rounded-full px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Link to="/dashboard">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12 mt-16" role="contentinfo">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2024 JobTrackr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
