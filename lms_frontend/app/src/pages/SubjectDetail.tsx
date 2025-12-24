import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, BookOpen, FileText, File, Download, ExternalLink } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  file_url: string;
}

export default function SubjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeType, setActiveType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: subjectData } = await supabase.from("subjects").select("*").eq("id", id).single();
    if (subjectData) setSubject(subjectData);

    const { data: resourceData } = await supabase.from("resources").select("*").eq("subject_id", id).eq("is_public", true);
    if (resourceData) setResources(resourceData);
    setLoading(false);
  };

  const filteredResources = resources.filter(r => activeType === "all" || r.resource_type === activeType);

  const typeIcons = {
    note: <FileText className="h-5 w-5" />,
    book: <BookOpen className="h-5 w-5" />,
    past_paper: <File className="h-5 w-5" />,
  };

  const typeColors = {
    note: "bg-accent/10 text-accent",
    book: "bg-success/10 text-success",
    past_paper: "bg-warning/10 text-warning",
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="grid md:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <div key={i} className="h-40 bg-muted rounded-xl" />)}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!subject) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Button asChild><Link to="/departments">Back to Departments</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/departments"><ChevronLeft className="h-4 w-4 mr-1" />Back</Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{subject.name}</h1>
              {subject.code && <span className="text-sm font-medium px-3 py-1 bg-accent/10 text-accent rounded-full">{subject.code}</span>}
            </div>
            <p className="text-muted-foreground max-w-2xl">{subject.description}</p>
          </div>
          <Button variant="accent" asChild>
            <Link to={`/ai-assistant?subject=${encodeURIComponent(subject.name)}`}>
              Ask AI Tutor
            </Link>
          </Button>
        </div>

        <Tabs value={activeType} onValueChange={setActiveType} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All ({resources.length})</TabsTrigger>
            <TabsTrigger value="note">Notes ({resources.filter(r => r.resource_type === "note").length})</TabsTrigger>
            <TabsTrigger value="book">Books ({resources.filter(r => r.resource_type === "book").length})</TabsTrigger>
            <TabsTrigger value="past_paper">Past Papers ({resources.filter(r => r.resource_type === "past_paper").length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredResources.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No resources available</h3>
              <p className="text-muted-foreground">Resources for this subject will be added soon.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="group hover:border-accent/50 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeColors[resource.resource_type as keyof typeof typeColors]}`}>
                      {typeIcons[resource.resource_type as keyof typeof typeIcons]}
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full capitalize">
                      {resource.resource_type.replace("_", " ")}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{resource.description || "Click to access this resource."}</CardDescription>
                  <Button variant="outline" size="sm" className="w-full group-hover:border-accent group-hover:text-accent" disabled={!resource.file_url}>
                    <Download className="h-4 w-4 mr-2" />
                    {resource.file_url ? "Download" : "Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
