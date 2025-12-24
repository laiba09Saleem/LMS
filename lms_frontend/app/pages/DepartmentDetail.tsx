import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  BookOpen, 
  FileText, 
  GraduationCap,
  ArrowRight,
  Folder
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  description: string;
}

interface Semester {
  id: string;
  name: string;
  semester_number: number;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  semester_id: string;
}

export default function DepartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<Department | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSemester, setActiveSemester] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDepartmentData();
    }
  }, [id]);

  const fetchDepartmentData = async () => {
    // Fetch department
    const { data: deptData } = await supabase
      .from("departments")
      .select("*")
      .eq("id", id)
      .single();
    
    if (deptData) setDepartment(deptData);

    // Fetch semesters
    const { data: semData } = await supabase
      .from("semesters")
      .select("*")
      .eq("department_id", id)
      .order("semester_number");
    
    if (semData && semData.length > 0) {
      setSemesters(semData);
      setActiveSemester(semData[0].id);
      
      // Fetch subjects for all semesters
      const { data: subData } = await supabase
        .from("subjects")
        .select("*")
        .in("semester_id", semData.map(s => s.id));
      
      if (subData) setSubjects(subData);
    }

    setLoading(false);
  };

  const getSubjectsForSemester = (semesterId: string) => {
    return subjects.filter(s => s.semester_id === semesterId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-4 w-96 bg-muted rounded" />
            <div className="grid md:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!department) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Department not found</h1>
          <Button asChild>
            <Link to="/departments">Back to Departments</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/departments">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Departments
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{department.name}</h1>
          <p className="text-muted-foreground max-w-2xl">{department.description}</p>
        </div>

        {semesters.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No semesters available</h3>
              <p className="text-muted-foreground">This department doesn't have any semesters yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeSemester} onValueChange={setActiveSemester}>
            <TabsList className="mb-8 flex-wrap h-auto gap-2">
              {semesters.map((sem) => (
                <TabsTrigger key={sem.id} value={sem.id} className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                  {sem.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {semesters.map((sem) => (
              <TabsContent key={sem.id} value={sem.id}>
                {getSubjectsForSemester(sem.id).length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">No subjects available</h3>
                      <p className="text-muted-foreground">This semester doesn't have any subjects yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getSubjectsForSemester(sem.id).map((subject) => (
                      <Link key={subject.id} to={`/subjects/${subject.id}`}>
                        <Card className="h-full group hover:border-accent/50 cursor-pointer">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                                <GraduationCap className="h-5 w-5" />
                              </div>
                              {subject.code && (
                                <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full">
                                  {subject.code}
                                </span>
                              )}
                            </div>
                            <CardTitle className="flex items-center justify-between text-lg">
                              {subject.name}
                              <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="line-clamp-2">
                              {subject.description || "Access notes, books, and past papers for this subject."}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
