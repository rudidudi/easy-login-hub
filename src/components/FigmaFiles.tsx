import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ExternalLink, FileImage, Plus, X, Figma } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFigmaConnection } from "@/lib/figma";

interface FigmaFile {
  key: string;
  name: string;
  thumbnail_url: string;
  last_modified: string;
}

const STORAGE_KEY = "designfolio_figma_files";

const getSavedFiles = (): FigmaFile[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveFiles = (files: FigmaFile[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
};

/** Extract file key from a Figma URL or raw key */
const parseFileKey = (input: string): string | null => {
  const trimmed = input.trim();
  // Match figma.com/file/KEY or figma.com/design/KEY
  const urlMatch = trimmed.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];
  // If it looks like a raw key (alphanumeric, 22+ chars)
  if (/^[a-zA-Z0-9]{10,}$/.test(trimmed)) return trimmed;
  return null;
};

const FigmaFiles = ({ connected }: { connected: boolean }) => {
  const [files, setFiles] = useState<FigmaFile[]>(getSavedFiles);
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFile = async () => {
    const key = parseFileKey(urlInput);
    if (!key) {
      setError("Paste a valid Figma file URL");
      return;
    }

    if (files.some((f) => f.key === key)) {
      setError("This file is already added");
      return;
    }

    const connection = getFigmaConnection();
    if (!connection?.access_token) {
      setError("Connect Figma first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.figma.com/v1/files/${key}?depth=1`, {
        headers: { Authorization: `Bearer ${connection.access_token}` },
      });

      if (!res.ok) {
        if (res.status === 404) setError("File not found — check the URL");
        else if (res.status === 403 || res.status === 401) setError("No access — reconnect Figma or check permissions");
        else setError("Could not load file");
        return;
      }

      const data = await res.json();
      const newFile: FigmaFile = {
        key,
        name: data.name || "Untitled",
        thumbnail_url: data.thumbnailUrl || "",
        last_modified: data.lastModified || new Date().toISOString(),
      };

      const updated = [newFile, ...files];
      setFiles(updated);
      saveFiles(updated);
      setUrlInput("");
    } catch {
      setError("Failed to fetch file");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (key: string) => {
    const updated = files.filter((f) => f.key !== key);
    setFiles(updated);
    saveFiles(updated);
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Figma className="h-10 w-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">
          Connect your Figma account to view your files.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add file input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Paste a Figma file URL..."
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAddFile()}
            disabled={loading}
            className="border-border/50"
          />
          <Button
            onClick={handleAddFile}
            disabled={!urlInput.trim() || loading}
            className="gap-2 shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add
          </Button>
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>

      {/* File grid */}
      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileImage className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            No files yet. Paste a Figma file URL above to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {files.map((file, i) => (
              <motion.div
                key={file.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative group"
              >
                <a
                  href={`https://www.figma.com/file/${file.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
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
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(file.key);
                  }}
                  className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500"
                  aria-label="Remove file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FigmaFiles;
