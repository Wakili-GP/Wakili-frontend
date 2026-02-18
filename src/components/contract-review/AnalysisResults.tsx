import {
  FileText,
  ShieldAlert,
  ClipboardList,
  TableIcon,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { ContractAnalysis } from "./UploadSection";

interface AnalysisResultsProps {
  analysis: ContractAnalysis;
  filename: string;
  onReset: () => void;
}

const riskSeverity = (index: number): "high" | "medium" | "low" => {
  if (index === 0) return "high";
  if (index < 3) return "medium";
  return "low";
};

const severityConfig = {
  high: {
    label: "عالي",
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  medium: {
    label: "متوسط",
    className: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  },
  low: {
    label: "منخفض",
    className: "bg-green-500/20 text-green-600 border-green-500/30",
  },
};

export default function AnalysisResults({
  analysis,
  filename,
  onReset,
}: AnalysisResultsProps) {
  return (
    <section className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">نتائج التحليل</h2>
      </div>

      {/* File info bar */}
      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-medium">{filename}</span>
          <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
            تم التحليل
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          رفع عقد آخر
        </Button>
      </div>

      <Tabs defaultValue="summary" dir="rtl">
        <TabsList className="grid grid-cols-4 w-full h-12">
          <TabsTrigger
            value="summary"
            className="cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            ملخص العقد
          </TabsTrigger>
          <TabsTrigger
            value="risks"
            className="cursor-pointer flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            المخاطر
          </TabsTrigger>
          <TabsTrigger
            value="obligations"
            className="cursor-pointer flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            الالتزامات
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="cursor-pointer flex items-center gap-2"
          >
            <TableIcon className="w-4 h-4" />
            المقارنة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                ملخص العقد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {analysis.summary}
              </p>
              <div className="mt-4">
                <Badge variant="secondary" className="text-base px-4 py-1">
                  نوع العقد: عقد بيع سيارة
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-destructive" />
                المخاطر القانونية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {analysis.risks.map((risk, i) => {
                  const severity = riskSeverity(i);
                  const config = severityConfig[severity];
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                      <span className="flex-1 text-base">{risk}</span>
                      <Badge className={config.className}>{config.label}</Badge>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="obligations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                الالتزامات حسب الأطراف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion
                type="multiple"
                defaultValue={Object.keys(analysis.obligations)}
                className="w-full"
              >
                {Object.entries(analysis.obligations).map(([party, duties]) => (
                  <AccordionItem key={party} value={party}>
                    <AccordionTrigger className=" cursor-pointer text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {party.charAt(0)}
                          </span>
                        </div>
                        {party}
                        <Badge variant="secondary">
                          {duties.length} التزام
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pr-11">
                        {duties.map((duty, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                              {i + 1}
                            </span>
                            <span>{duty}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-primary" />
                جدول المقارنة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.comparison_table.length > 0 && (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        {Object.keys(analysis.comparison_table[0]).map(
                          (col) => (
                            <TableHead
                              key={col}
                              className="text-center font-bold text-base"
                            >
                              {col}
                            </TableHead>
                          ),
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.comparison_table.map((row, i) => (
                        <TableRow key={i} className="hover:bg-muted/30">
                          {Object.values(row).map((cell, j) => (
                            <TableCell key={j} className="text-center">
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
