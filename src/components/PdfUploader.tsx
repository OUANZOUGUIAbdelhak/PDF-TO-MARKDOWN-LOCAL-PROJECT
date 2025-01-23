import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const PdfUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      // Replace this URL with your actual backend API endpoint
      const response = await fetch("YOUR_BACKEND_API_URL", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      
      // Handle the OCR results here
      console.log("OCR Results:", result);
      
      toast({
        title: "Success",
        description: "PDF processed successfully",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your PDF",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">PDF OCR Processor</h1>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected file: {file.name}
            </p>
          )}
          <Button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Process PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfUploader;