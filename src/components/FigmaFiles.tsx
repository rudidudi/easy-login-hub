import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ExternalLink, FileImage, Figma, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFigmaConnection } from "@/lib/figma";

interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
  project_name: string;
}

const TEAM_ID_KEY = "designfolio_figma_team_id";

const FigmaFiles = ({ connected }: { connected: boolean }) => {
  const [teamId, setTeamId] = useState(() => localStorage.getItem(TEAM_ID_KEY) || "");
  const [teamIdInput, setTeamIdInput] = useState("");
  const [files, setFiles] = useState<FigmaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async (id: string) => {
    const connection = getFigmaConnection();
    if (!connection?.access_token) return;

    setLoading(true);
    setError(null);
    setFiles([]);

    try {
      // 1. Fetch all projects in the team
      const projectsRes = await fetch(`https://api.figma.com/v1/teams/${id}/projects`, {
        headers: { Authorization: `Bearer ${connection.access_token}` },
      });

      if (!projectsRes.ok) {
        if (projectsRes.status === 403 || projectsRes.status === 401) {
          setError("Access denied — reconnect Figma or check the Team ID");
        } else if (projectsRes.status === 404) {
          setError("Team not found — double-check your Team ID");
        } else {
          setError("Could not load projects");
        }
        return;
      }

      const projectsData = await projectsRes.json();
      const projects: { id: string; name: string }[] = projectsData.projects || [];

      if (projects.length === 0) {
        setError("No projects found in this team");
        return;
      }

      // 2. Fetch files for each project in parallel
      const allFiles: FigmaFile[] = [];

      await Promise.all(
        projects.map(async (project) => {
          try {
            const filesRes = await fetch(`https://api.figma.com/v1/projects/${project.id}/files`, {
              headers: { Authorization: `Bearer ${connection.access_token}` },
            });
            if (!filesRes.ok) return;
            const filesData = await filesRes.json();
            const projectFiles: FigmaFile[] = (filesData.files || []).map((f: any) => ({
              key: f.key,
              name: f.name,
              thumbnail_url: f.thumbnail_url || "",
              last_modified: f.last_modified || "",
              project_name: project.name,
            }));
            allFiles.push(...projectFiles);
          } catch {
            // skip failed projects silently
          }
        })
      );

      // Sort by last modified
      allFiles.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime());
      setFiles(allFiles);
    } catch {
      setError("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount if team ID is already saved
  useEffect(() => {
    if (connected && teamId) {
      fetchFiles(teamId);
    }
  }, [connected, teamId]);

  const handleSaveTeamId = () => {
    const id = teamIdInput.trim();
    if (!id) return;
    localStorage.setItem(TEAM_ID_KEY, id);
    setTeamId(id);
    setTeamIdInput("");
  };

  const handleReset = () => {
    localStorage.removeItem(TEAM_ID_KEY);
    setTeamId("");
    setFiles([]);
    setError(null);
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Figma className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Connect your Figma account to view your files.</p>
      </div>
    );
  }

  // Team ID setup screen
  if (!teamId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border/50 bg-card p-6 space-y-4"
      >
        <div>
          <h3 className="text-sm font-semibold text-foreground">Connect your Figma team</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your Figma Team ID once and your files will load automatically every time.
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 border border-border/50 px-4 py-3 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Where to find your Team ID:</p>
          <p>Open Figma → click on your team name in the left sidebar → look at the URL:</p>
          <code className="block mt-1 bg-background rounded px-2 py-1 text-[11px]">
            figma.com/files/team/<span className="text-primary font-bold">1234567890</span>/Your-Team
          </code>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="e.g. 1234567890"
            value={teamIdInput}
            onChange={(e) => setTeamIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTeamId()}
            className="border-border/50"
          />
          <Button
            onClick={handleSaveTeamId}
            disabled={!teamIdInput.trim()}
            className="shrink-0"
          >
            Connect
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {loading ? "Loading files..." : `${files.length} file${files.length !== 1 ? "s" : ""}`}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchFiles(teamId)}
            disabled={loading}
            className="h-7 gap-1.5 text-xs text-muted-foreground"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Change team
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Fetching your Figma files...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* File grid */}
      {!loading && !error && files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {files.map((file, i) => (
              <motion.a
                key={file.key}
                href={`https://www.figma.com/file/${file.key}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="group block"
              >
                <Card className="border-border/50 bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="aspect-[16/10] bg-muted/50 relative overflow-hidden">
                    {file.thumbnail_url ? (
                      <img
                        src={file.thumbnail_url}
                        alt={file.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FileImage className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 shadow-sm">
                        <ExternalLink className="h-3.5 w-3.5 text-gray-700" />
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                        {file.project_name}
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {file.last_modified
                        ? new Date(file.last_modified).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </Card>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileImage className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No files found in this team.</p>
        </div>
      )}
    </div>
  );
};

export default FigmaFiles;
