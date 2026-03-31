import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, ExternalLink, FileImage } from "lucide-react";
import { motion } from "framer-motion";
import { getFigmaConnection } from "@/lib/figma";

interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
}

const FigmaFiles = ({ connected }: { connected: boolean }) => {
  const [files, setFiles] = useState<FigmaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!connected) {
      setFiles([]);
      return;
    }

    const fetchFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const connection = getFigmaConnection();
        if (!connection?.access_token) return;

        const res = await fetch("https://api.figma.com/v1/me/files/recent", {
          headers: { Authorization: `Bearer ${connection.access_token}` },
        });

        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            setError("Token expired — reconnect Figma");
          } else {
            setError("Could not load files");
          }
          return;
        }

        const data = await res.json();
        const recentFiles: FigmaFile[] = (data.files || []).slice(0, 6);
        setFiles(recentFiles);
      } catch {
        setError("Failed to fetch files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [connected]);

  if (!connected) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading your Figma files...</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">{error}</p>
    );
  }

  if (files.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Recent Figma files
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, i) => (
          <motion.div
            key={file.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <a
              href={`https://www.figma.com/file/${file.key}`}
              target="_blank"
              rel="noopener noreferrer"
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
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(file.last_modified).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FigmaFiles;
