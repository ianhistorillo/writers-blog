import React, { useState, useEffect } from "react";
import { Upload, Image, File, Trash2, Download, Eye, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card, { CardContent, CardHeader } from "../components/ui/Card";

interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
  public_url?: string;
}

interface MediaPageProps {
  selectionMode?: boolean;
  onSelect?: (file: MediaFile) => void;
  onClose?: () => void;
}

const MediaPage: React.FC<MediaPageProps> = ({
  selectionMode = false,
  onSelect,
  onClose,
}) => {
  const { user } = useAuth();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaFiles = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from("media_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching media files:", error);
        setError("Failed to load media files");
        return;
      }

      const filesWithUrls = data.map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("media")
          .getPublicUrl(file.file_path);

        return {
          ...file,
          public_url: publicUrlData.publicUrl,
        };
      });

      setMediaFiles(filesWithUrls);
    } catch (error) {
      console.error("Unexpected error fetching media files:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, [user]);

  const handleFileUpload = async (files: FileList) => {
    if (!user || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/") &&
          !file.type.startsWith("audio/") &&
          !file.type.includes("pdf") &&
          !file.type.includes("document")
        ) {
          throw new Error(`Unsupported file type: ${file.type}`);
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(
            `File too large: ${file.name}. Maximum size is 10MB.`
          );
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(
            `Failed to upload ${file.name}: ${uploadError.message}`
          );
        }

        // Save file metadata to database
        const { error: dbError } = await supabase.from("media_files").insert({
          filename: fileName,
          original_name: file.name,
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        });

        if (dbError) {
          console.error("Database error:", dbError);
          // Clean up uploaded file if database insert fails
          await supabase.storage.from("media").remove([fileName]);
          throw new Error(
            `Failed to save ${file.name} metadata: ${dbError.message}`
          );
        }

        return uploadData;
      });

      await Promise.all(uploadPromises);

      // Refresh the file list
      await fetchMediaFiles();
    } catch (error) {
      console.error("Error uploading files:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error uploading files. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      setError(null);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([file.file_path]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
        throw new Error(
          `Failed to delete file from storage: ${storageError.message}`
        );
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("media_files")
        .delete()
        .eq("id", file.id);

      if (dbError) {
        console.error("Database deletion error:", dbError);
        throw new Error(`Failed to delete file record: ${dbError.message}`);
      }

      // Refresh the file list
      await fetchMediaFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error deleting file. Please try again."
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isImage = (mimeType: string) => {
    return mimeType.startsWith("image/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading media files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectionMode && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Select Media</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!selectionMode && (
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <label htmlFor="file-upload">
            <Button variant="primary" as="span" isLoading={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files)
              }
              className="hidden"
            />
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-gray-500 mb-2">
              Support for images, documents, and other media files
            </p>
            <p className="text-sm text-gray-400">Maximum file size: 10MB</p>
            <label htmlFor="file-upload-drop">
              <Button
                variant="secondary"
                className="mt-4"
                as="span"
                disabled={isUploading}
              >
                Choose Files
              </Button>
              <input
                id="file-upload-drop"
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files)
                }
                className="hidden"
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">
              Uploaded Files ({mediaFiles.length})
            </h2>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">
                Grid View
              </Button>
              <Button variant="ghost" size="sm">
                List View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {mediaFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mediaFiles.map((file) => (
                <div
                  key={file.id}
                  className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                    selectionMode ? "cursor-pointer hover:border-blue-500" : ""
                  }`}
                  onClick={() => selectionMode && onSelect && onSelect(file)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {isImage(file.mime_type) ? (
                      <img
                        src={file.public_url}
                        alt={file.original_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Image load error for:",
                            file.public_url
                          );
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : (
                      <File className="h-12 w-12 text-gray-400" />
                    )}
                    {isImage(file.mime_type) && (
                      <div className="hidden w-full h-full flex items-center justify-center">
                        <File className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3
                      className="font-medium text-gray-900 truncate mb-1"
                      title={file.original_name}
                    >
                      {file.original_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatFileSize(file.file_size)} •{" "}
                      {formatDate(file.created_at)}
                    </p>
                    {!selectionMode && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1"
                          onClick={() => window.open(file.public_url, "_blank")}
                          title="View"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = file.public_url || "";
                            link.download = file.original_name;
                            link.click();
                          }}
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(file);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No media files uploaded yet</p>
              <label htmlFor="file-upload-empty">
                <Button variant="primary" as="span" disabled={isUploading}>
                  Upload your first file
                </Button>
                <input
                  id="file-upload-empty"
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files)
                  }
                  className="hidden"
                />
              </label>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;
