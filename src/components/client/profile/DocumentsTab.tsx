import { Calendar, Download, FileText, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDocuments } from "@/data/data";

const DocumentsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-secondary" />
          مستنداتي
        </h2>
        <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
          <Upload className="w-4 h-4 ml-2" />
          رفع مستند جديد
        </Button>
      </div>

      <div className="space-y-3">
        {mockDocuments.map((doc) => (
          <Card key={doc.id} className="p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{doc.name}</h3>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {doc.uploadDate}
                    </span>
                    <span>{doc.size}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {doc.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-3.5 h-3.5 ml-1" />
                  تحميل
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentsTab;
