import React, { useState, useEffect } from 'react';
import { Upload, Image, File, Trash2, Download, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader } from '../components/ui/Card';

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

  const fetchMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error.message);
        return;
      }

      console.log('Media files fetched:', data);

      const filesWithUrls = data.map((file) => {
        const { publicUrl } = supabase.storage.from('media').getPublicUrl(file.file_path);
        return {
          ...file,
          public_url: publicUrl,
        };
      });

      setMediaFiles(filesWithUrls);
    } catch (error) {
      console.error('Unexpected error fetching media files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered. User:', user);
    if (user) {
      fetchMediaFiles();
    }
  }, [user]);

  const handleFileUpload = async (files: FileList) => {
    if (!user || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Save file metadata to database
        const { error: dbError } = await supabase
          .from('media_files')
          .insert({
            filename: fileName,
            original_name: file.name,
            file_path: fileName,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: user.id,
          });

        if (dbError) throw dbError;
      }

      // Refresh the file list
      await fetchMediaFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      // Refresh the file list
      await fetchMediaFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isImage = (mimeType: string) => {
    return mimeType.startsWith('image/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              Upload Files
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

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-gray-500">
              Support for images, documents, and other media files
            </p>
            <label htmlFor="file-upload-drop">
              <Button variant="secondary" className="mt-4" as="span">
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
            <h2 className="text-lg font-medium">Uploaded Files</h2>
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
                    selectionMode ? 'cursor-pointer hover:border-blue-500' : ''
                  }`}
                  onClick={() =>
                    selectionMode && onSelect && onSelect(file)
                  }
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {isImage(file.mime_type) ? (
                      <img
                        src={file.public_url}
                        alt={file.original_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <File className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 truncate mb-1">
                      {file.original_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
                    </p>
                    {!selectionMode && (
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="flex-1">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1"
                          onClick={() => window.open(file.public_url, '_blank')}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(file)}
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
                <Button variant="primary" as="span">
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
