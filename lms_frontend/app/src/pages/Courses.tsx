import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Play, Clock, User, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Course { id: string; title: string; description: string; thumbnail_url: string; instructor_name: string; duration: string; }

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchCourses(); }, [user]);

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").eq("is_published", true);
    if (data) setCourses(data);
    if (user) {
      const { data: enrollments } = await supabase.from("course_enrollments").select("course_id").eq("user_id", user.id);
      if (enrollments) setEnrolledIds(enrollments.map(e => e.course_id));
    }
    setLoading(false);
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) { toast.error("Please sign in to enroll"); return; }
    const { error } = await supabase.from("course_enrollments").insert({ course_id: courseId, user_id: user.id });
    if (error) toast.error("Failed to enroll");
    else { toast.success("Enrolled successfully!"); setEnrolledIds([...enrolledIds, courseId]); }
  };

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Courses</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Explore our courses and start learning today.</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{Array(6).fill(0).map((_, i) => <Card key={i} className="animate-pulse"><div className="h-40 bg-muted rounded-t-xl" /><CardHeader><div className="h-6 w-3/4 bg-muted rounded" /></CardHeader></Card>)}</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12"><BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="font-semibold">No courses available yet</h3></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden group">
                <div className="h-40 bg-gradient-hero flex items-center justify-center"><Play className="h-12 w-12 text-accent-foreground/50" /></div>
                <CardHeader><CardTitle className="text-lg">{course.title}</CardTitle></CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-2">{course.description || "Start learning today"}</CardDescription>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    {course.instructor_name && <span className="flex items-center gap-1"><User className="h-3 w-3" />{course.instructor_name}</span>}
                    {course.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>}
                  </div>
                  {enrolledIds.includes(course.id) ? (
                    <Button variant="secondary" className="w-full" asChild><Link to="/dashboard">Continue Learning</Link></Button>
                  ) : (
                    <Button variant="accent" className="w-full" onClick={() => handleEnroll(course.id)}>Enroll Now</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
