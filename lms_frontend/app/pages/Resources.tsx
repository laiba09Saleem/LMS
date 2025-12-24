import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, FileText, File, Download, ExternalLink } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  file_url: string;
  subjects: { name: string } | null;
}

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState(searchParams.get("type") || "all");

  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    const { data } = await supabase.from("resources").select("*, subjects(name)").eq("is_public", true);
    if (data) setResources(data as unknown as Resource[]);
    setLoading(false);
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === "all" || r.resource_type === activeType;
    return matchesSearch && matchesType;
  });

  const typeIcons = { note: <FileText className="h-5 w-5" />, book: <BookOpen className="h-5 w-5" />, past_paper: <File className="h-5 w-5" /> };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Learning Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Access notes, books, and past papers to support your studies.</p>
          <div className="max-w-md mx-auto relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search resources..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Tabs value={activeType} onValueChange={(v) => { setActiveType(v); setSearchParams(v === "all" ? {} : { type: v }); }}>
            <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="note">Notes</TabsTrigger><TabsTrigger value="book">Books</TabsTrigger><TabsTrigger value="past_paper">Past Papers</TabsTrigger></TabsList>
          </Tabs>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{Array(6).fill(0).map((_, i) => <Card key={i} className="animate-pulse"><CardHeader><div className="h-6 w-3/4 bg-muted rounded" /></CardHeader><CardContent><div className="h-4 w-full bg-muted rounded" /></CardContent></Card>)}</div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12"><BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="font-semibold mb-2">No resources found</h3></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">{typeIcons[resource.resource_type as keyof typeof typeIcons]}</div>
                    <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full capitalize">{resource.resource_type.replace("_", " ")}</span>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{resource.description || "No description available."}</CardDescription>
                  {resource.subjects && <p className="text-xs text-muted-foreground mb-4">Subject: {resource.subjects.name}</p>}
                  <Button variant="outline" size="sm" className="w-full" disabled={!resource.file_url}><Download className="h-4 w-4 mr-2" />{resource.file_url ? "Download" : "Coming Soon"}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
