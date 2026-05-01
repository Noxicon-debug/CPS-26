import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cpsContact } from '../../content/cpsContact';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const PageSettingsManager = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [heroSettings, setHeroSettings] = useState({
    tagline: 'Faith & Excellence',
    title: 'Catholic Professionals',
    subtitle: 'of Papua New Guinea',
    description: 'Uniting professionals in faith, service, and excellence. Together, we build a community rooted in Catholic values while advancing our nation.',
    ctaPrimary: 'Join Our Community',
    ctaSecondary: 'Learn More'
  });

  const [aboutSettings, setAboutSettings] = useState({
    tagline: 'About Us',
    title: 'Our Story',
    description: 'The Catholic Professionals Society of Papua New Guinea was established to create a vibrant community of Catholic professionals dedicated to integrating faith with professional excellence.',
    mission: 'To unite Catholic professionals in Papua New Guinea, fostering a community that promotes Christian values in the workplace, provides networking opportunities, and encourages service to the Church and society.',
    vision: 'To be a leading voice for Catholic professionals in Papua New Guinea, inspiring excellence, integrity, and service across all sectors of society while contributing to the nation\'s development.'
  });

  const [footerSettings, setFooterSettings] = useState({
    tagline: 'Uniting Catholic professionals across Papua New Guinea to serve, connect, and grow together in faith and excellence.',
    address: cpsContact.footer.address,
    email: cpsContact.footer.email,
    phone: cpsContact.footer.phone,
    facebook: '',
    twitter: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [heroRes, aboutRes, footerRes] = await Promise.all([
        axios.get(`${API}/settings/hero`),
        axios.get(`${API}/settings/about`),
        axios.get(`${API}/settings/footer`)
      ]);
      
      if (heroRes.data.settings && Object.keys(heroRes.data.settings).length > 0) {
        setHeroSettings(prev => ({ ...prev, ...heroRes.data.settings }));
      }
      if (aboutRes.data.settings && Object.keys(aboutRes.data.settings).length > 0) {
        setAboutSettings(prev => ({ ...prev, ...aboutRes.data.settings }));
      }
      if (footerRes.data.settings && Object.keys(footerRes.data.settings).length > 0) {
        setFooterSettings(prev => ({ ...prev, ...footerRes.data.settings }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (page, settings) => {
    setSaving(true);
    try {
      await axios.put(`${API}/settings/${page}`, { settings }, { withCredentials: true });
      toast.success(`${page.charAt(0).toUpperCase() + page.slice(1)} settings saved!`);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading settings...</div>;
  }

  return (
    <div data-testid="page-settings-manager">
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="mb-6 bg-[#EAE5DC]">
          <TabsTrigger value="hero" className="data-[state=active]:bg-[#1C2522] data-[state=active]:text-[#F8F5F0]">
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-[#1C2522] data-[state=active]:text-[#F8F5F0]">
            About Page
          </TabsTrigger>
          <TabsTrigger value="footer" className="data-[state=active]:bg-[#1C2522] data-[state=active]:text-[#F8F5F0]">
            Footer
          </TabsTrigger>
        </TabsList>

        {/* Hero Settings */}
        <TabsContent value="hero">
          <Card className="p-6 bg-white border-none shadow-sm">
            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-6">
              Hero Section Settings
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={heroSettings.tagline}
                    onChange={(e) => setHeroSettings({ ...heroSettings, tagline: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={heroSettings.title}
                    onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input
                  value={heroSettings.subtitle}
                  onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={heroSettings.description}
                  onChange={(e) => setHeroSettings({ ...heroSettings, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Primary CTA Text</Label>
                  <Input
                    value={heroSettings.ctaPrimary}
                    onChange={(e) => setHeroSettings({ ...heroSettings, ctaPrimary: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Secondary CTA Text</Label>
                  <Input
                    value={heroSettings.ctaSecondary}
                    onChange={(e) => setHeroSettings({ ...heroSettings, ctaSecondary: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                onClick={() => saveSettings('hero', heroSettings)}
                disabled={saving}
                className="w-fit bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] rounded-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Hero Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* About Settings */}
        <TabsContent value="about">
          <Card className="p-6 bg-white border-none shadow-sm">
            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-6">
              About Page Settings
            </h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={aboutSettings.tagline}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, tagline: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={aboutSettings.title}
                    onChange={(e) => setAboutSettings({ ...aboutSettings, title: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={aboutSettings.description}
                  onChange={(e) => setAboutSettings({ ...aboutSettings, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label>Mission Statement</Label>
                <Textarea
                  value={aboutSettings.mission}
                  onChange={(e) => setAboutSettings({ ...aboutSettings, mission: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label>Vision Statement</Label>
                <Textarea
                  value={aboutSettings.vision}
                  onChange={(e) => setAboutSettings({ ...aboutSettings, vision: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <Button
                onClick={() => saveSettings('about', aboutSettings)}
                disabled={saving}
                className="w-fit bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] rounded-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save About Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Footer Settings */}
        <TabsContent value="footer">
          <Card className="p-6 bg-white border-none shadow-sm">
            <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1C2522] mb-6">
              Footer Settings
            </h3>
            <div className="grid gap-4">
              <div>
                <Label>Tagline</Label>
                <Textarea
                  value={footerSettings.tagline}
                  onChange={(e) => setFooterSettings({ ...footerSettings, tagline: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Address</Label>
                  <Input
                    value={footerSettings.address}
                    onChange={(e) => setFooterSettings({ ...footerSettings, address: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={footerSettings.email}
                    onChange={(e) => setFooterSettings({ ...footerSettings, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={footerSettings.phone}
                    onChange={(e) => setFooterSettings({ ...footerSettings, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Facebook URL</Label>
                  <Input
                    value={footerSettings.facebook}
                    onChange={(e) => setFooterSettings({ ...footerSettings, facebook: e.target.value })}
                    className="mt-1"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>
              <Button
                onClick={() => saveSettings('footer', footerSettings)}
                disabled={saving}
                className="w-fit bg-[#1C2522] text-[#F8F5F0] hover:bg-[#2D3B36] rounded-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Footer Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
