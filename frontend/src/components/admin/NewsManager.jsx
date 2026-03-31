import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Newspaper, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categories = ['Announcements', 'Community', 'Partnerships', 'Spirituality', 'Member Stories', 'Annual Report'];

export const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    category: '',
    readTime: '5 min read',
    featured: false,
    published: true,
    image: ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${API}/news?published_only=false`, { withCredentials: true });
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingNews) {
        await axios.put(`${API}/news/${editingNews.id}`, formData, { withCredentials: true });
        toast.success('Article updated successfully!');
      } else {
        await axios.post(`${API}/news`, formData, { withCredentials: true });
        toast.success('Article created successfully!');
      }
      fetchNews();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await axios.delete(`${API}/news/${id}`, { withCredentials: true });
      toast.success('Article deleted');
      fetchNews();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleEdit = (article) => {
    setEditingNews(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      date: article.date,
      author: article.author,
      category: article.category,
      readTime: article.readTime,
      featured: article.featured,
      published: article.published,
      image: article.image || ''
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      category: '',
      readTime: '5 min read',
      featured: false,
      published: true,
      image: ''
    });
  };

  if (loading) {
    return <div className="animate-pulse">Loading news...</div>;
  }

  return (
    <div data-testid="news-manager">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522]">
          News & Blog Articles
        </h3>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-news-button" className="bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] rounded-sm">
              <Plus className="w-4 h-4 mr-2" />
              Write Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-['Cormorant_Garamond'] text-2xl">
                {editingNews ? 'Edit Article' : 'Write New Article'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Excerpt *</Label>
                <Textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="mt-1"
                  rows={2}
                  placeholder="Brief summary of the article..."
                />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-1"
                  rows={8}
                  placeholder="Full article content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Author *</Label>
                  <Input
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Read Time</Label>
                  <Input
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="mt-1"
                    placeholder="5 min read"
                  />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1"
                  placeholder="/images/Highlights/..."
                />
              </div>

              <div className="flex gap-6 border-t pt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label>Featured Article</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label>Published</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-[#1C2522] text-[#F8F5F0]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {editingNews ? 'Update Article' : 'Publish Article'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {news.length === 0 ? (
          <Card className="p-8 text-center bg-white border-none">
            <Newspaper className="w-12 h-12 text-[#C29B57] mx-auto mb-4" />
            <p className="text-[#4A5D54]">No articles yet. Write your first article!</p>
          </Card>
        ) : (
          news.map((article) => (
            <Card key={article.id} className="p-4 bg-white border-none shadow-sm">
              <div className="flex items-start gap-4">
                {article.image && (
                  <img src={article.image} alt={article.title} className="w-24 h-24 object-cover rounded-sm" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-[#1C2522] flex items-center gap-2">
                        {article.title}
                        {article.featured && (
                          <span className="text-xs bg-[#C29B57] text-white px-2 py-0.5 rounded-sm">Featured</span>
                        )}
                        {!article.published && (
                          <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-sm">Draft</span>
                        )}
                      </h4>
                      <p className="text-sm text-[#4A5D54] mt-1 line-clamp-2">{article.excerpt}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(article)} className="rounded-sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)} className="rounded-sm text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-sm text-[#4A5D54]">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.author}</span>
                    <span>•</span>
                    <span className="bg-[#EAE5DC] px-2 py-0.5 rounded-sm">{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
