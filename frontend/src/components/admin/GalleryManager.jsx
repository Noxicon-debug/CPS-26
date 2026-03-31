import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Image, Upload, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const GalleryManager = () => {
  const [images, setImages] = useState({ db_images: [], fs_images: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (caption) formData.append('caption', caption);
    if (category) formData.append('category', category);

    try {
      await axios.post(`${API}/gallery`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Image uploaded successfully!');
      fetchImages();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await axios.delete(`${API}/gallery/${id}`, { withCredentials: true });
      toast.success('Image deleted');
      fetchImages();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setCaption('');
    setCategory('');
  };

  if (loading) {
    return <div className="animate-pulse">Loading gallery...</div>;
  }

  const allImages = [
    ...images.db_images.map(img => ({ ...img, source: 'uploaded' })),
    ...images.fs_images.map(img => ({ ...img, source: 'filesystem' }))
  ];

  return (
    <div data-testid="gallery-manager">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522]">
            Photo Gallery
          </h3>
          <p className="text-sm text-[#4A5D54] mt-1">
            {allImages.length} images ({images.db_images.length} uploaded, {images.fs_images.length} from highlights)
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="upload-image-button" className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] rounded-sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-['Cormorant_Garamond'] text-2xl">
                Upload New Image
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 mt-4">
              <div>
                <Label>Select Image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="mt-1"
                />
              </div>
              {selectedFile && (
                <div className="p-4 bg-[#EAE5DC] rounded-sm">
                  <p className="text-sm text-[#1C2522]">
                    Selected: {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#4A5D54]">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
              <div>
                <Label>Caption (optional)</Label>
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1"
                  placeholder="Describe the image..."
                />
              </div>
              <div>
                <Label>Category (optional)</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., Events, Leadership, Community"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading || !selectedFile} className="bg-[#1C2522] text-[#F8F5F0]">
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Uploaded Images Section */}
      {images.db_images.length > 0 && (
        <div className="mb-8">
          <h4 className="font-medium text-[#1C2522] mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Uploaded Images ({images.db_images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.db_images.map((image) => (
              <Card key={image.id} className="relative group overflow-hidden bg-white border-none shadow-sm">
                <img
                  src={image.path}
                  alt={image.caption || image.filename}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className="rounded-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {image.caption && (
                  <p className="p-2 text-xs text-[#4A5D54] truncate">{image.caption}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filesystem Images Section */}
      <div>
        <h4 className="font-medium text-[#1C2522] mb-4 flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          Highlights Folder ({images.fs_images.length} images)
        </h4>
        {images.fs_images.length === 0 ? (
          <Card className="p-8 text-center bg-white border-none">
            <Image className="w-12 h-12 text-[#C29B57] mx-auto mb-4" />
            <p className="text-[#4A5D54]">No images in the Highlights folder</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.fs_images.slice(0, 48).map((image, idx) => (
              <Card key={image.id || idx} className="relative group overflow-hidden bg-white border-none shadow-sm">
                <img
                  src={image.path}
                  alt={image.filename}
                  className="w-full h-32 object-cover"
                />
                <p className="p-2 text-xs text-[#4A5D54] truncate">{image.filename}</p>
              </Card>
            ))}
          </div>
        )}
        {images.fs_images.length > 48 && (
          <p className="text-center text-sm text-[#4A5D54] mt-4">
            Showing 48 of {images.fs_images.length} images
          </p>
        )}
      </div>
    </div>
  );
};
