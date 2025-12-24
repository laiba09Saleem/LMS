import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  FileText, 
  Clock, 
  Award,
  Bell,
  ArrowRight,
  Play,
  CheckCircle,
  Calendar
} from "lucide-react";

interface Enrollment {
  id: string;
  progress: number;
  courses: {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
  };
}

interface QuizSubmission {
  id: string;
  score: number;
  total_marks: number;
  submitted_at: string;
  quizzes: {
    title: string;
  };
}

interface Assignment {
  id: string;
  title: string;
  due_date: string;
  total_marks: number;
  courses: {
    title: string;
  } | null;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizSubmission[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    // Fetch enrollments with course info
    const { data: enrollmentData } = await supabase
      .from("course_enrollments")
      .select(`
        id,
        progress,
        courses (
          id,
          title,
          description,
          thumbnail_url
        )
      `)
      .eq("user_id", user.id)
      .limit(4);

    if (enrollmentData) {
      setEnrollments(enrollmentData as unknown as Enrollment[]);
    }

    // Fetch recent quiz submissions
    const { data: quizData } = await supabase
      .from("quiz_submissions")
      .select(`
        id,
        score,
        total_marks,
        submitted_at,
        quizzes (
          title
        )
      `)
      .eq("user_id", user.id)
      .order("submitted_at", { ascending: false })
      .limit(3);

    if (quizData) {
      setRecentQuizzes(quizData as unknown as QuizSubmission[]);
    }

    // Fetch upcoming assignments
    const { data: assignmentData } = await supabase
      .from("assignments")
      .select(`
        id,
        title,
        due_date,
        total_marks,
        courses (
          title
        )
      `)
      .eq("is_published", true)
      .gte("due_date", new Date().toISOString())
      .order("due_date", { ascending: true })
      .limit(3);

    if (assignmentData) {
      setUpcomingAssignments(assignmentData as unknown as Assignment[]);
    }

    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <Layout showFooter={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  const stats = [
    { label: "Enrolled Courses", value: enrollments.length, icon: BookOpen, color: "bg-accent/10 text-accent" },
    { label: "Quizzes Taken", value: recentQuizzes.length, icon: FileText, color: "bg-success/10 text-success" },
    { label: "Assignments Due", value: upcomingAssignments.length, icon: Clock, color: "bg-warning/10 text-warning" },
    { label: "Avg. Score", value: recentQuizzes.length > 0 
      ? Math.round(recentQuizzes.reduce((acc, q) => acc + (q.score / q.total_marks) * 100, 0) / recentQuizzes.length) + "%" 
      : "N/A", 
      icon: Award, 
      color: "bg-primary/10 text-primary" 
    },
  ];

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your learning journey.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">My Courses</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/courses">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            {enrollments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No courses enrolled yet</h3>
                  <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in a course.</p>
                  <Button asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="group cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-accent/10 text-accent flex-shrink-0">
                          <Play className="h-8 w-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{enrollment.courses.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{enrollment.courses.description}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Quiz Results */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                {recentQuizzes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No quizzes taken yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentQuizzes.map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                            <CheckCircle className="h-4 w-4 text-success" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{quiz.quizzes.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(quiz.submitted_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold">
                          {quiz.score}/{quiz.total_marks}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Assignments */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAssignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No upcoming assignments</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                          <Calendar className="h-4 w-4 text-warning" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{assignment.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
