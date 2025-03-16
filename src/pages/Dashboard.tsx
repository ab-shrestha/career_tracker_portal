import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Sankey, TooltipProps } from "recharts";
import { CheckCircle2, FileBarChart, BarChart2, ListChecks, Building2, AlertCircle, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { format } from "date-fns";

const Dashboard = () => {
  const { 
    applications, 
    tasks,
    getTasksDueSoon,
    companies, 
    contacts,
    reflection,
    getContactsNeedingFollowup
  } = useData();

  // Get all incomplete tasks
  const incompleteTasks = tasks.filter(task => !task.completed);

  // Get tasks that are overdue or due in next 2 days
  const urgentTasks = incompleteTasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);
    return taskDate <= twoDaysLater;
  });

  // Get remaining incomplete tasks
  const otherTasks = incompleteTasks.filter(task => !urgentTasks.includes(task));

  // Sort tasks by due date and priority
  const sortTasks = (tasks: any[]) => {
    return [...tasks].sort((a, b) => {
      const dateComparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      if (dateComparison !== 0) {
        return dateComparison;
      }
      const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    });
  };

  const sortedUrgentTasks = sortTasks(urgentTasks);
  const sortedOtherTasks = sortTasks(otherTasks);

  // Get tasks due in the next 2 days
  const tasksDueSoon = getTasksDueSoon();

  // Check if contact was last contacted more than 3 months ago
  const isFollowupNeeded = (lastContactDate: string) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return new Date(lastContactDate) < threeMonthsAgo;
  };

  // Calculate contacts needing follow-up based on both status and last contact date
  const contactsNeedingFollowup = contacts.filter(contact => {
    const needsFollowupStatus = contact.status === "Follow-up";
    const needsFollowupDate = isFollowupNeeded(contact.lastContact);
    return needsFollowupStatus || needsFollowupDate;
  });

  // Calculate application statistics in the correct order
  const applicationStats = [
    { name: "Learning", value: applications.filter(app => app.status === "Learning").length },
    { name: "Draft", value: applications.filter(app => app.status === "Draft").length },
    { name: "Applied", value: applications.filter(app => app.status === "Applied").length },
    { name: "Screening", value: applications.filter(app => app.status === "Screening").length },
    { name: "Interview", value: applications.filter(app => app.status === "Interview").length },
    { name: "Rejected", value: applications.filter(app => app.status === "Rejected").length },
    { name: "Offer", value: applications.filter(app => app.status === "Offer").length },
    { name: "Declined", value: applications.filter(app => app.status === "Declined").length },
    { name: "Accepted", value: applications.filter(app => app.status === "Accepted").length },
  ];

  // Create Sankey data
  const sankeyData = {
    nodes: applicationStats.map(stat => ({ name: stat.name })),
    links: [
      // Sequential flow from Learning to Offer
      { source: 0, target: 1, value: Math.max(applicationStats[0].value, applicationStats[1].value) }, // Learning -> Draft
      { source: 1, target: 2, value: Math.max(applicationStats[1].value, applicationStats[2].value) }, // Draft -> Applied
      { source: 2, target: 3, value: Math.max(applicationStats[2].value, applicationStats[3].value) }, // Applied -> Phone Screen
      { source: 3, target: 4, value: Math.max(applicationStats[3].value, applicationStats[4].value) }, // Phone Screen -> Interview
      { source: 4, target: 6, value: Math.max(applicationStats[4].value, applicationStats[6].value) }, // Interview -> Offer

      // Rejection paths (showing current rejected applications)
      { source: 0, target: 5, value: applicationStats[5].value * 0.2 }, // Learning -> Rejected
      { source: 1, target: 5, value: applicationStats[5].value * 0.2 }, // Draft -> Rejected
      { source: 2, target: 5, value: applicationStats[5].value * 0.2 }, // Applied -> Rejected
      { source: 3, target: 5, value: applicationStats[5].value * 0.2 }, // Phone Screen -> Rejected
      { source: 4, target: 5, value: applicationStats[5].value * 0.2 }, // Interview -> Rejected

      // Final branching from Offer
      { source: 6, target: 7, value: applicationStats[7].value }, // Offer -> Declined
      { source: 6, target: 8, value: applicationStats[8].value }, // Offer -> Accepted
    ]
  };

  // Custom tooltip for Sankey chart
  const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">Applications: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate task statistics
  const taskStats = {
    completed: tasks.filter(task => task.completed).length,
    total: tasks.length,
    upcoming: tasks.filter(task => !task.completed).length,
    overdue: tasks.filter(task => !task.completed && new Date(task.dueDate + 'T00:00:00') < new Date()).length,
    dueToday: tasks.filter(task => !task.completed && 
      format(new Date(task.dueDate + 'T00:00:00'), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length
  };

  // Get top target companies (sorted by score)
  const topCompanies = [...companies].sort((a, b) => b.score - a.score);
  const topThreeCompanies = topCompanies.slice(0, 3);
  const topScore = topThreeCompanies[0]?.score || 0;
  const companiesWithTopScore = topCompanies.filter(company => company.score === topScore);
  const additionalCompaniesWithTopScore = companiesWithTopScore.length - 3;

  // Get reflection status
  const reflectionProgress = {
    strengths: reflection.strengths,
    story: reflection.storySections.filter(section => section.value.trim() !== "").length,
    values: reflection.values,
    total: reflection.storySections.length + 2, // +2 for strengths and values sections
    completed: reflection.storySections.filter(section => section.value.trim() !== "").length 
      + (reflection.strengths.length > 0 ? 1 : 0)
      + (reflection.values.length > 0 ? 1 : 0)
  };

  const progressPercentage = Math.round((reflectionProgress.completed / reflectionProgress.total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Get an overview of your job search progress, upcoming tasks, and key metrics at a glance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/applications" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription>Total Applications</CardDescription>
              <CardTitle className="text-3xl">{applications.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center">
                <ListChecks className="mr-1 h-4 w-4" />
                <span>{applicationStats[4]?.value || 0} in interview stage</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/tasks" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription>Tasks</CardDescription>
              <CardTitle className="text-3xl">{taskStats.upcoming}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <div className="flex items-center">
                  <AlertCircle className="mr-1 h-4 w-4 text-destructive" />
                  <span>{taskStats.overdue} overdue</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-amber-400" />
                  <span>{taskStats.dueToday} due today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/target-companies" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription>Target Companies</CardDescription>
              <CardTitle className="text-3xl">{companies.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center">
                <Building2 className="mr-1 h-4 w-4" />
                <span className="truncate">
                  {topThreeCompanies.length > 0 ? (
                    <>
                      {topThreeCompanies.map((company, index) => (
                        <span key={company.id}>
                          {company.name}
                          {index < topThreeCompanies.length - 1 && ", "}
                        </span>
                      ))}
                    </>
                  ) : (
                    "No companies"
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/networking" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <CardDescription>Network Contacts</CardDescription>
              <CardTitle className="text-3xl">{contacts.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex items-center">
                <Users className="mr-1 h-4 w-4" />
                <span>{contactsNeedingFollowup.length} need follow-up</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Link to="/applications" className="block lg:col-span-4">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationStats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      height={60}
                    />
                    <YAxis 
                      hide
                      domain={[0, 'dataMax + 1']}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                      label={{ 
                        position: 'top', 
                        fontSize: 12,
                        formatter: (value: number) => value || 0
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Tasks</CardTitle>
            </div>
            <Link to="/tasks">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {incompleteTasks.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {incompleteTasks.slice(0, 4).map(task => (
                    <div key={task.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(task.dueDate + 'T00:00:00'), 'MMM d, yyyy')}
                          <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                            task.priority === "High" ? "bg-red-100 text-red-800" :
                            task.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }`}>
                            {task.priority}
                          </span>
                          {new Date(task.dueDate + 'T00:00:00') < new Date() && (
                            <span className="ml-2 text-xs text-destructive">Overdue</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <Link to="/tasks">
                          <Button variant="ghost" size="sm">
                            <Clock className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  {incompleteTasks.length > 4 && (
                    <div className="text-xs text-muted-foreground text-right">
                      +{incompleteTasks.length - 4} more tasks
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[220px] text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No incomplete tasks!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/target-companies" className="block">
          <Card className="hover:bg-accent/50 transition-colors h-full">
            <CardHeader>
              <CardTitle>Top Target Companies</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)]">
              {topThreeCompanies.length > 0 ? (
                <>
                  <div className="flex-1 space-y-4">
                    {topThreeCompanies.map(company => (
                      <div key={company.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {company.affinity === "Y" ? "Connection" : "No connection"}
                          </p>
                        </div>
                        <div>
                          <span className="text-xl font-bold">{Math.round((company.score / 18) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                    {additionalCompaniesWithTopScore > 0 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{additionalCompaniesWithTopScore} more {additionalCompaniesWithTopScore === 1 ? 'company' : 'companies'} with the same score
                      </p>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View All</Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col flex-1 justify-center items-center">
                  <p className="text-muted-foreground">No target companies added yet</p>
                  <Button variant="outline" className="mt-2">Add Companies</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link to="/networking" className="block">
          <Card className="hover:bg-accent/50 transition-colors h-full">
            <CardHeader>
              <CardTitle>Contacts To Follow-up</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)]">
              {contactsNeedingFollowup.length > 0 ? (
                <>
                  <div className="flex-1 space-y-4">
                    {contactsNeedingFollowup.slice(0, 3).map(contact => (
                      <div key={contact.id} className="space-y-1">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.company} - {contact.position}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>Last: {format(new Date(contact.lastContact), 'MMM d, yyyy')}</span>
                          {isFollowupNeeded(contact.lastContact) && (
                            <span className="inline-flex items-center text-amber-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </span>
                          )}
                          {contact.status === "Follow-up" && (
                            <span className="inline-flex items-center text-blue-600">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Follow-up
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View All</Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col flex-1 justify-center items-center">
                  <p className="text-muted-foreground">No contacts need follow-up</p>
                  <Button variant="outline" className="mt-2">View Contacts</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link to="/reflection-journal" className="block">
          <Card className="hover:bg-accent/50 transition-colors h-full">
            <CardHeader>
              <CardTitle>Reflection Journal</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)]">
              <div className="flex-1 space-y-4">
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {progressPercentage}% Complete
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {reflection.industries.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                      {reflection.industries[0].value}
                      {reflection.industries.length > 1 && ` +${reflection.industries.length - 1}`}
                    </span>
                  )}
                  {reflection.roles.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                      {reflection.roles[0].value}
                      {reflection.roles.length > 1 && ` +${reflection.roles.length - 1}`}
                    </span>
                  )}
                  {reflection.intersections.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                      {reflection.intersections[0].value}
                      {reflection.intersections.length > 1 && ` +${reflection.intersections.length - 1}`}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Strengths</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reflectionProgress.strengths.slice(0, 3).map(strength => (
                        <span key={strength.id} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {strength.value}
                        </span>
                      ))}
                      {reflectionProgress.strengths.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                          +{reflectionProgress.strengths.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Values</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reflectionProgress.values.slice(0, 3).map(value => (
                        <span key={value.id} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {value.value}
                        </span>
                      ))}
                      {reflectionProgress.values.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                          +{reflectionProgress.values.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">Continue</Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
