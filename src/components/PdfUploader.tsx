import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

const PdfUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFormat, setInputFormat] = useState("pdf");
  const [outputFormat, setOutputFormat] = useState("markdown");
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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
    formData.append("outputFormat", outputFormat);

    try {
      const response = await fetch("YOUR_BACKEND_API_URL", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const result = await response.json();
      console.log("Conversion Results:", result);
      
      toast({
        title: "Success",
        description: "Document converted successfully",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: "There was an error converting your document",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1A1F2C] overflow-hidden">
      {/* Nuclear Animation Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="nuclear-particles" />
      </div>
      
      {/* CEA Logo */}
      <img 
        src="/lovable-uploads/8df9e81b-f484-4fad-a8b9-f9e67f6721da.png" 
        alt="CEA Logo" 
        className="absolute top-4 left-4 w-16 h-16"
      />

      <div className="w-full max-w-xl p-8 space-y-6 relative z-10">
        <h1 className="text-4xl font-bold text-center text-[#0FA0CE] mb-2">Document Converter</h1>
        <p className="text-center text-gray-400 mb-8">Transform your documents into any format with ease</p>

        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-[#33C3F0] rounded-lg p-8 text-center hover:border-[#0FA0CE] transition-colors cursor-pointer bg-[#221F26]/50 backdrop-blur-sm"
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-[#33C3F0] mb-4" />
            <p className="text-gray-300">
              {file ? file.name : "Drag & drop your file here, or click to select"}
            </p>
          </label>
        </div>

        {/* Format Selection */}
        <div className="grid grid-cols-2 gap-4">
          <Select value={inputFormat} onValueChange={setInputFormat}>
            <SelectTrigger className="bg-[#221F26]/50 border-[#33C3F0]">
              <SelectValue placeholder="Input format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>

          <Select value={outputFormat} onValueChange={setOutputFormat}>
            <SelectTrigger className="bg-[#221F26]/50 border-[#33C3F0]">
              <SelectValue placeholder="Output format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="text">Plain Text</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full bg-[#0FA0CE] hover:bg-[#33C3F0] transition-colors"
        >
          {isLoading ? "Converting..." : "Convert File"}
        </Button>
      </div>
    </div>
  );
};

export default PdfUploader;