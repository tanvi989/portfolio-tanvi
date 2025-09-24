
import NoteCard from "../components/NoteCard";
import { NoteCardProps } from "../components/NoteCard";
export const metadata = {
  title: "Notes",
  description: "Quick previews and downloads for my study PDFs.",
};

const notes: NoteCardProps[] = [
  {
    title: "DBMS – Unit 4 (Sathyabama Univ.)",
    desc: "Normalization, decomposition, and design theory (official course material).",
    gradient: "from-indigo-600 to-purple-500",
    tags: ["DBMS", "Normalization", "Design Theory"],
    // external PDF you provided:
    pdfUrl: "https://www.sathyabama.ac.in/sites/default/files/course-material/2020-10/UNIT4.pdf",
  },
  // add more notes here as you gather PDFs
];

export default function NotesPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Notes</h1>
      <p className="text-center text-sm text-[var(--text-secondary)] mb-12">
        Preview in a modal, or download/open in a new tab.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {notes.map((n) => (
          <div key={n.title} className="note-card-anim">
            <NoteCard {...n} />
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-center text-[var(--text-secondary)]">
        Heads-up: some hosts block embedding PDFs. If the preview doesn’t load, use “Open in New Tab”.
      </p>
    </main>
  );
}
