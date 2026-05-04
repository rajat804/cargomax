"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FolderOpen,
  Upload,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  FileImage,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PODFile {
  id: number;
  name: string;
  imageUrl: string;
  size: number;
  type: string;
  uploaded: boolean;
  error?: string;
}

interface GRRecord {
  id: number;
  grNo: string;
  files: PODFile[];
  submitted: boolean;
}

export default function PODUpload() {
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [folderName, setFolderName] = useState<string>("");
  const [grRecords, setGrRecords] = useState<GRRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample GR data
  const sampleGRs = [
    { id: 1, grNo: "GR001" },
    { id: 2, grNo: "GR002" },
    { id: 3, grNo: "GR003" },
    { id: 4, grNo: "GR004" },
    { id: 5, grNo: "GR005" },
  ];

  const handleFolderSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newGRs: GRRecord[] = [];
      
      // Group files by GR number (assuming filename format contains GR number)
      files.forEach((file, index) => {
        // Extract GR number from filename (example: GR001_image.jpg)
        const grMatch = file.name.match(/(GR\d+)/i);
        const grNo = grMatch ? grMatch[1] : `GR${String(index + 1).padStart(3, "0")}`;
        
        const existingGR = newGRs.find(g => g.grNo === grNo);
        const podFile: PODFile = {
          id: Date.now() + index,
          name: file.name,
          imageUrl: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploaded: false,
        };
        
        if (existingGR) {
          existingGR.files.push(podFile);
        } else {
          newGRs.push({
            id: Date.now() + index,
            grNo: grNo,
            files: [podFile],
            submitted: false,
          });
        }
      });
      
      setGrRecords([...grRecords, ...newGRs]);
      setFolderName(`${files.length} files selected`);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      // Show all GRs
      const allGRs = sampleGRs.map(gr => ({
        id: gr.id,
        grNo: gr.grNo,
        files: grRecords.find(r => r.grNo === gr.grNo)?.files || [],
        submitted: grRecords.find(r => r.grNo === gr.grNo)?.submitted || false,
      }));
      setGrRecords(allGRs);
    } else {
      // Filter GRs by search term
      const filtered = sampleGRs
        .filter(gr => gr.grNo.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(gr => ({
          id: gr.id,
          grNo: gr.grNo,
          files: grRecords.find(r => r.grNo === gr.grNo)?.files || [],
          submitted: grRecords.find(r => r.grNo === gr.grNo)?.submitted || false,
        }));
      setGrRecords(filtered);
    }
  };

  const handleAddFilesToGR = (grNo: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const newFiles: PODFile[] = Array.from(files).map((file, idx) => ({
          id: Date.now() + idx,
          name: file.name,
          imageUrl: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploaded: false,
        }));
        
        setGrRecords(grRecords.map(gr => 
          gr.grNo === grNo 
            ? { ...gr, files: [...gr.files, ...newFiles] }
            : gr
        ));
      }
    };
    input.click();
  };

  const handleRemoveFile = (grNo: string, fileId: number) => {
    setGrRecords(grRecords.map(gr =>
      gr.grNo === grNo
        ? { ...gr, files: gr.files.filter(f => f.id !== fileId) }
        : gr
    ));
  };

  const handleViewImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleSubmitGR = async (grNo: string) => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setGrRecords(grRecords.map(gr =>
        gr.grNo === grNo
          ? { ...gr, submitted: true, files: gr.files.map(f => ({ ...f, uploaded: true })) }
          : gr
      ));
      setUploading(false);
      alert(`GR ${grNo} submitted successfully!`);
    }, 1500);
  };

  const handleSubmitAll = async () => {
    const pendingGRs = grRecords.filter(gr => !gr.submitted && gr.files.length > 0);
    if (pendingGRs.length === 0) {
      alert("No pending GRs to upload");
      return;
    }
    
    setUploading(true);
    // Simulate upload all
    setTimeout(() => {
      setGrRecords(grRecords.map(gr =>
        gr.files.length > 0 && !gr.submitted
          ? { ...gr, submitted: true, files: gr.files.map(f => ({ ...f, uploaded: true })) }
          : gr
      ));
      setUploading(false);
      alert(`${pendingGRs.length} GR(s) submitted successfully!`);
    }, 2000);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all uploaded files?")) {
      setGrRecords([]);
      setFolderName("");
      setSearchTerm("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const filteredGRs = grRecords.filter(gr => 
    gr.grNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">POD UPLOAD</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Scan Folder Location */}
      <div className="flex flex-wrap items-end gap-3 p-4 border rounded-md bg-muted/20">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-xs font-medium">Scan Folder Location</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={folderName}
              readOnly
              placeholder="No folder selected"
              className="h-8 text-xs bg-muted"
            />
            <Button
              onClick={handleFolderSelect}
              variant="outline"
              size="sm"
              className="h-8 text-xs"
            >
              <FolderOpen className="mr-1 h-3.5 w-3.5" />
              Browse
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Select folder containing POD images (JPG, PNG, PDF)
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by GR #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
          <Search className="mr-1 h-3.5 w-3.5" />
          SEARCH
        </Button>
        <Button onClick={handleClearAll} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          CLEAR ALL
        </Button>
      </div>

      {/* Main Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[600px]">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">S#</TableHead>
                <TableHead className="min-w-[100px]">GR #</TableHead>
                <TableHead className="min-w-[300px]">Image</TableHead>
                <TableHead className="min-w-[120px] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGRs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileImage className="h-8 w-8 text-muted-foreground" />
                      <span>No GR records found. Please select a folder to upload images.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGRs.map((record, idx) => (
                  <TableRow key={record.id} className="hover:bg-muted/30">
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell className="font-mono font-medium">{record.grNo}</TableCell>
                    <TableCell>
                      {record.files.length === 0 ? (
                        <div className="text-muted-foreground text-[10px]">
                          No images uploaded
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {record.files.map((file) => (
                            <div
                              key={file.id}
                              className="relative group cursor-pointer"
                              onClick={() => handleViewImage(file.imageUrl)}
                            >
                              <div className="w-16 h-16 rounded-md border overflow-hidden bg-muted/20">
                                <img
                                  src={file.imageUrl}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {file.uploaded && (
                                <div className="absolute -top-1 -right-1">
                                  <CheckCircle className="h-4 w-4 text-green-500 bg-white rounded-full" />
                                </div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile(record.grNo, file.id);
                                }}
                                className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <div className="bg-red-500 rounded-full p-0.5">
                                  <Trash2 className="h-3 w-3 text-white" />
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleAddFilesToGR(record.grNo)}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          Add
                        </Button>
                        {record.files.length > 0 && !record.submitted && (
                          <Button
                            onClick={() => handleSubmitGR(record.grNo)}
                            size="sm"
                            className="h-7 text-xs bg-green-600 hover:bg-green-700"
                            disabled={uploading}
                          >
                            {uploading ? (
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            Submit
                          </Button>
                        )}
                        {record.submitted && (
                          <span className="text-green-600 text-[10px] flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Uploaded
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          onClick={handleSubmitAll}
          size="sm"
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
          disabled={uploading || grRecords.filter(g => !g.submitted && g.files.length > 0).length === 0}
        >
          {uploading ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Upload className="mr-1 h-3 w-3" />
          )}
          SUBMIT & UPLOAD ALL
        </Button>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-base">POD Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="POD Preview"
                className="max-w-full max-h-[60vh] object-contain rounded-md"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsImageModalOpen(false)}>
              CLOSE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Summary */}
      {grRecords.length > 0 && (
        <div className="bg-muted/30 rounded-md p-3">
          <div className="flex flex-wrap justify-between gap-2 text-xs">
            <span>Total GRs: {grRecords.length}</span>
            <span>Total Images: {grRecords.reduce((sum, gr) => sum + gr.files.length, 0)}</span>
            <span>Submitted: {grRecords.filter(g => g.submitted).length}</span>
            <span>Pending: {grRecords.filter(g => !g.submitted && g.files.length > 0).length}</span>
          </div>
        </div>
      )}
    </div>
  );
}