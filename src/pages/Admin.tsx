import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";
import { subjectData } from "@/lib/constants";
import { bulkInsertQuestions } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import type { Question } from "@/lib/constants";
import { motion } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.234/pdf.worker.min.js";

type ParsedQuestion = {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

const allSubjects = Object.values(subjectData).flat().map(s => s.name);

const Admin = () => {
  const { toast } = useToast();
  const [subject, setSubject] = useState<string>(allSubjects[0] || "CRK/IRK");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
  const [uploading, setUploading] = useState(false);
  const [insertedCount, setInsertedCount] = useState<number | null>(null);

  const subjectOptions = useMemo(() => allSubjects, []);

  const extractPdfText = async (pdfFile: File): Promise<string> => {
    const data = await pdfFile.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data }).promise;
    let fullText = "";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const items = (content as unknown as { items: Array<{ str: string }> }).items;
      const strings = items.map((it) => it.str);
      fullText += strings.join(" ") + "\n";
    }
    return fullText;
  };

  const parseQuestionsFromText = (text: string): ParsedQuestion[] => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const joined = lines.join("\n");
    const qBlocks = joined.split(/\n(?=\d{1,3}[.)]\s)/);
    const results: ParsedQuestion[] = [];
    for (const block of qBlocks) {
      const headMatch = block.match(/^\s*\d{1,3}[.)]\s*(.+?)(?:\n|$)/);
      if (!headMatch) continue;
      const qText = headMatch[1].trim();
      const options: string[] = [];
      const optRegex = /^(?:\s*\(?([A-D])[.)]\s+(.+))$/gm;
      let m: RegExpExecArray | null;
      while ((m = optRegex.exec(block)) !== null) {
        options.push(m[2].trim());
      }
      if (options.length < 2) {
        const inlineOpts = block.match(/\b[A-D][.)]\s+[^A-D]+/g) || [];
        inlineOpts.forEach(o => {
          const cleaned = o.replace(/^[A-D][.)]\s+/, "").trim();
          if (cleaned) options.push(cleaned);
        });
      }
      let correctIndex = 0;
      const ansMatch = block.match(/Answer\s*[:-]\s*([A-D])/i) || block.match(/\bCorrect\s*[:-]\s*([A-D])/i);
      if (ansMatch) {
        const letter = ansMatch[1].toUpperCase();
        correctIndex = Math.max(0, "ABCD".indexOf(letter));
      }
      if (qText && options.length >= 2) {
        results.push({ text: qText, options: options.slice(0, 4), correctAnswer: correctIndex });
      }
    }
    return results;
  };

  const handleParse = async () => {
    if (!file) return;
    setParsing(true);
    setInsertedCount(null);
    try {
      const text = await extractPdfText(file);
      const items = parseQuestionsFromText(text);
      setParsed(items);
      toast({ title: "Parsed PDF", description: `${items.length} questions found` });
    } catch (err) {
      toast({ variant: "destructive", title: "Parse failed", description: "Could not extract questions from PDF" });
    } finally {
      setParsing(false);
    }
  };

  const handleInsert = async () => {
    if (parsed.length === 0) return;
    setUploading(true);
    try {
      const res = await bulkInsertQuestions(subject, parsed as unknown as Question[]);
      setInsertedCount(res.inserted);
      toast({ title: "Upload complete", description: `${res.inserted} questions inserted for ${subject}` });
    } catch {
      toast({ variant: "destructive", title: "Upload failed", description: "Database insertion failed" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          Admin Dashboard
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Upload PDF of Past Questions</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">System reads the PDF and pastes questions with option answers accurately.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <label className="text-sm text-muted-foreground">Subject</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm bg-background"
                >
                  {subjectOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <Input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                />
                <Button onClick={handleParse} disabled={!file || parsing}>
                  {parsing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {parsing ? "Reading PDF..." : "Read PDF"}
                </Button>
              </div>
              {parsed.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{parsed.length} questions parsed</span>
                    <Button onClick={handleInsert} disabled={uploading}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {uploading ? "Uploading..." : "Insert into Database"}
                    </Button>
                  </div>
                  {insertedCount !== null && (
                    <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{insertedCount} inserted</span>
                    </div>
                  )}
                  <ScrollArea className="h-[360px] border rounded-lg">
                    <div className="p-4 space-y-4">
                      {parsed.map((q, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <div className="text-sm font-medium">Q{i + 1}. {q.text}</div>
                          <ul className="mt-2 text-sm list-disc ml-5">
                            {q.options.map((o, idx) => (
                              <li key={idx} className={idx === q.correctAnswer ? "text-primary" : ""}>
                                {String.fromCharCode(65 + idx)}. {o}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
            <CardFooter />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
