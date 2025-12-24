import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Users, 
  Award, 
  Monitor, 
  Briefcase, 
  Settings, 
  ArrowRight,
  Play,
  CheckCircle
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  monitor: <Monitor className="h-8 w-8" />,
  briefcase: <Briefcase className="h-8 w-8" />,
  settings: <Settings className="h-8 w-8" />,
  "book-open": <BookOpen className="h-8 w-8" />,
};

const features = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Comprehensive Resources",
    description: "Access notes, books, and past papers organized by department and semester.",
  },
  {
    icon: <Play className="h-6 w-6" />,
    title: "Online Courses",
    description: "Learn at your own pace with video courses and interactive content.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Quizzes & Assignments",
    description: "Test your knowledge with auto-graded quizzes and submit assignments online.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Track Progress",
    description: "Monitor your learning journey with detailed progress tracking.",
  },
];

const stats = [
  { value: "10K+", label: "Students" },
  { value: "500+", label: "Resources" },
  { value: "50+", label: "Courses" },
  { value: "98%", label: "Satisfaction" },
];

export default function Index() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const { data } = await supabase.from("departments").select("*");
    if (data) setDepartments(data);
    setLoading(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-8 animate-fade-in">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-medium">Start Learning Today</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-accent-foreground mb-6 leading-tight animate-slide-up">
              Unlock Your
              <span className="block text-gradient">Academic Potential</span>
            </h1>
            
            <p className="text-lg md:text-xl text-accent-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Access comprehensive learning resources, take quizzes, submit assignments, and track your progress all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?tab=signup">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/departments">
                  Browse Departments
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent-foreground">{stat.value}</div>
                  <div className="text-sm text-accent-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools and resources you need for academic excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group hover:border-accent/50 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Departments</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our wide range of departments and find resources tailored to your field of study.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-muted" />
                    <div className="h-6 w-3/4 bg-muted rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-muted rounded mb-2" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))
            ) : (
              departments.map((dept) => (
                <Link key={dept.id} to={`/departments/${dept.id}`}>
                  <Card className="h-full group hover:border-accent/50 cursor-pointer">
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        {iconMap[dept.icon] || <BookOpen className="h-8 w-8" />}
                      </div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{dept.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/departments">
                View All Departments
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-accent-foreground/80 mb-10 text-lg">
              Join thousands of students who are already using EduLearn to achieve their academic goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?tab=signup">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-accent-foreground/70 text-sm">
              {["Free to start", "No credit card required", "Cancel anytime"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
