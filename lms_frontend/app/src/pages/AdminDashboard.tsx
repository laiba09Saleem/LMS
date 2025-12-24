import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FileText, GraduationCap, Settings, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || (role !== "admin" && role !== "super_admin"))) {
      navigate("/");
    }
  }, [user, role, loading, navigate]);

  if (loading) return <Layout showFooter={false}><div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading...</div></div></Layout>;

  const adminModules = [
    { title: "Manage Users", description: "View and manage student accounts", icon: Users, color: "bg-accent/10 text-accent" },
    { title: "Departments", description: "Add and edit departments and semesters", icon: GraduationCap, color: "bg-success/10 text-success" },
    { title: "Resources", description: "Upload notes, books, and past papers", icon: FileText, color: "bg-warning/10 text-warning" },
    { title: "Courses", description: "Create and manage courses", icon: BookOpen, color: "bg-primary/10 text-primary" },
    { title: "Reports", description: "View analytics and progress reports", icon: BarChart3, color: "bg-destructive/10 text-destructive" },
    { title: "Settings", description: "System configuration and preferences", icon: Settings, color: "bg-muted text-muted-foreground" },
  ];

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your LMS system from here.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <Card key={module.title} className="cursor-pointer hover:border-accent/50 transition-all">
              <CardHeader>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${module.color} mb-4`}><module.icon className="h-6 w-6" /></div>
                <CardTitle>{module.title}</CardTitle>
              </CardHeader>
              <CardContent><CardDescription>{module.description}</CardDescription></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
