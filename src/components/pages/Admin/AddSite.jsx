import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Plus, Loader2 } from 'lucide-react';
import { axiosInstance } from '../../baseurl/axiosInstance';

// --- Reusable Component for Array Inputs ---
const ArrayInput = ({ label, placeholder, items, setItems, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !items.includes(trimmedValue)) {
      setItems([...items, trimmedValue]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <Button 
          type="button" 
          onClick={handleAddItem} 
          disabled={disabled || !inputValue.trim()}
          size="icon"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium pl-3 pr-2 py-1 rounded-full">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item)}
                className="ml-2 text-gray-500 hover:text-red-600 disabled:opacity-50"
                disabled={disabled}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default function AddSite() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: '',
    youtubeLink: '',
    drawCharges: '',
    state: '',
    city: '',
    units: '',
    description: '',
    current: '',
    image: '', // Single image string
    paymentPlan: [], // Array of strings
    plotSizes: [],   // Array of strings
    preferences: []  // Array of strings
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleArrayChange = (field, newArray) => {
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, image: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async () => {
    if (!formData.siteName || !formData.state || !formData.city || !formData.current) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);

    // Helper to format arrays as "{item1,item2}" string
    const formatArrayForApi = (arr) => {
      if (!arr || arr.length === 0) return ""; // Send empty string if no items
      return `{${arr.join(',')}}`;
    };
    
    try {
      const payload = {
        name: formData.siteName,
        yout_link: formData.youtubeLink,
        draw_charges: formData.drawCharges,
        state: formData.state,
        city: formData.city,
        units: formData.units,
        des: formData.description,
        status: formData.current,
        image: formData.image,
        payment_plan: formatArrayForApi(formData.paymentPlan),
        plot_sizes: formatArrayForApi(formData.plotSizes),
        prefer: formatArrayForApi(formData.preferences)
      };

      console.log('Sending payload:', payload);

      const response = await axiosInstance.post('/create-site', payload);
      
      console.log('Site created successfully:', response.data);
      alert('Site created successfully!');
      
      resetForm();
      setOpen(false);
      
    } catch (error) {
      console.error('Error creating site:', error);
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Failed to create site';
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        alert('Network error. Please check your connection.');
      } else {
        alert('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      siteName: '',
      youtubeLink: '',
      drawCharges: '',
      state: '',
      city: '',
      units: '',
      description: '',
      current: '',
      image: '',
      paymentPlan: [],
      plotSizes: [],
      preferences: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Site
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] bg-white max-w-2xl h-[95vh] max-h-[800px] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold">Add New Site</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fields from original component remain here... */}
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-sm font-medium">Site Name *</Label>
                <Input id="siteName" value={formData.siteName} onChange={(e) => handleInputChange('siteName', e.target.value)} placeholder="Enter site name" required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeLink" className="text-sm font-medium">YouTube Link</Label>
                <Input id="youtubeLink" value={formData.youtubeLink} onChange={(e) => handleInputChange('youtubeLink', e.target.value)} placeholder="https://youtube.com/..." type="url" disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drawCharges" className="text-sm font-medium">Draw Charges</Label>
                <Input id="drawCharges" value={formData.drawCharges} onChange={(e) => handleInputChange('drawCharges', e.target.value)} placeholder="Enter draw charges" type="number" disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="units" className="text-sm font-medium">Units</Label>
                <Input id="units" value={formData.units} onChange={(e) => handleInputChange('units', e.target.value)} placeholder="Number of units" type="number" disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">State *</Label>
                <Input id="state" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} placeholder="Enter state" required disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                <Input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} placeholder="Enter city" required disabled={loading} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current" className="text-sm font-medium">Current Status *</Label>
              <Select value={formData.current} onValueChange={(value) => handleInputChange('current', value)} disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Select current status" /></SelectTrigger>
                <SelectContent className="bg-green-100">
                  <SelectItem value="testimonial">Testimonial</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Enter site description" rows={3} disabled={loading} />
            </div>

            {/* --- New Array Inputs --- */}
            <ArrayInput
              label="Payment Plans"
              placeholder="Add a payment plan (e.g., 24 Months EMI)"
              items={formData.paymentPlan}
              setItems={(newItems) => handleArrayChange('paymentPlan', newItems)}
              disabled={loading}
            />

            <ArrayInput
              label="Plot Sizes"
              placeholder="Add a plot size (e.g., 100 sq yards)"
              items={formData.plotSizes}
              setItems={(newItems) => handleArrayChange('plotSizes', newItems)}
              disabled={loading}
            />
            
            <ArrayInput
              label="Preferences / Highlights"
              placeholder="Add a preference (e.g., Gated Community)"
              items={formData.preferences}
              setItems={(newItems) => handleArrayChange('preferences', newItems)}
              disabled={loading}
            />
            
            {/* --- Single Image Upload --- */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Image</Label>
              {!formData.image && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" disabled={loading} />
                  <label htmlFor="imageUpload" className={`cursor-pointer ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  </label>
                </div>
              )}
              {formData.image && (
                <Card className="relative max-w-xs">
                  <CardContent className="p-2">
                    <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded" />
                    <Button type="button" variant="destructive" size="sm" className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0" onClick={removeImage} disabled={loading}>
                      <X className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto" disabled={loading}>Cancel</Button>
              <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto" onClick={handleSubmit} disabled={loading}>
                {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</>) : ('Save Site')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}