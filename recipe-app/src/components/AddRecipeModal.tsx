import { useState } from "react";

export default function AddRecipeModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (p: {
    title: string;
    image?: string;
    sourceUrl?: string;
    readyInMinutes?: number;
    servings?: number;
    summary?: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [readyInMinutes, setReadyInMinutes] = useState("");
  const [servings, setServings] = useState("");
  const [summary, setSummary] = useState("");

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      image: image.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      readyInMinutes: readyInMinutes ? Number(readyInMinutes) : undefined,
      servings: servings ? Number(servings) : undefined,
      summary: summary.trim() || undefined,
    });
    setTitle(""); setImage(""); setSourceUrl(""); setReadyInMinutes(""); setServings(""); setSummary("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-card-foreground">Add Local Recipe</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Tom Yum Goong"
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
              <input
                value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Source URL</label>
              <input
                value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://example.com/recipe"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ready in Minutes</label>
              <input
                type="number" min={0} value={readyInMinutes} onChange={(e) => setReadyInMinutes(e.target.value)} placeholder="e.g., 30"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Servings</label>
              <input
                type="number" min={1} value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g., 2"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Summary</label>
            <textarea
              value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short description or HTML snippet" rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-shadow resize-none"
            />
          </div>

          <p className="text-xs text-muted-foreground">Stored in localStorage. Supports plain text or HTML in summary field.</p>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all">Cancel</button>
            <button type="submit" disabled={!title.trim()} className="px-5 py-2.5 rounded-xl bg-success text-success-foreground font-medium hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed">Save Recipe</button>
          </div>
        </form>
      </div>
    </div>
  );
}
