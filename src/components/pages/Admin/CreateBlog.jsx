import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus } from 'lucide-react';
import { axiosInstance } from '../../baseurl/axiosInstance';

const CreateBlog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subheading: '',
    description: '',
    image: '',
    hashtags: [],
    category: '',
    location: '',
    posted_by: '',
    min_read: ''
  });
  const [currentHashtag, setCurrentHashtag] = useState('');

  // Mock categories related to real estate and properties
  const categories = [
    'Residential Properties',
    'Commercial Real Estate',
    'Investment Properties',
    'Property Management',
    'Real Estate Market Analysis',
    'Home Buying Tips',
    'Property Development',
    'Rental Properties',
    'Luxury Real Estate',
    'Property Financing',
    'Real Estate Technology',
    'Property Renovation'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('image', e.target.result); // a base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const addHashtag = () => {
    if (currentHashtag.trim() && !formData.hashtags.includes(currentHashtag.trim())) {
      handleInputChange('hashtags', [...formData.hashtags, currentHashtag.trim()]);
      setCurrentHashtag('');
    }
  };

  const removeHashtag = (tagToRemove) => {
    handleInputChange('hashtags', formData.hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.posted_by || !formData.min_read) {
      alert('Please fill in all required fields marked with *');
      return;
    }
    
    setIsLoading(true);

    // Format hashtags into the required string format "{tag1,tag2}"
    const formattedHashtags = `{${formData.hashtags.join(',')}}`;

    const payload = {
      ...formData,
      hashtags: formattedHashtags,
    };

    try {
      // Send data to the API endpoint
      const response = await axiosInstance.post('/create-blog', payload);
      console.log('Blog created successfully:', response.data);

      alert('Blog created successfully!');
      setOpen(false);
      
      // Reset form on successful submission
      setFormData({
        title: '',
        subheading: '',
        description: '',
        image: '',
        hashtags: [],
        category: '',
        location: '',
        posted_by: '',
        min_read: ''
      });
      setCurrentHashtag('');

    } catch (error) {
      console.error('Error creating blog post:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create blog post. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Blog
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-white overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new blog post about real estate and properties.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            {/* Subheading */}
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <Input
                id="subheading"
                placeholder="Enter subheading"
                value={formData.subheading}
                onChange={(e) => handleInputChange('subheading', e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter blog description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Upload className="w-4 h-4 text-gray-500" />
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label htmlFor="hashtags">Hashtags</Label>
              <div className="flex space-x-2">
                <Input
                  id="hashtags"
                  placeholder="Enter hashtag and press Enter"
                  value={currentHashtag}
                  onChange={(e) => setCurrentHashtag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHashtag();
                    }
                  }}
                />
                <Button type="button" onClick={addHashtag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    #{tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeHashtag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => handleInputChange('category', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>

            {/* Posted By */}
            <div className="space-y-2">
              <Label htmlFor="posted_by">Posted By *</Label>
              <Input
                id="posted_by"
                placeholder="Enter author name"
                value={formData.posted_by}
                onChange={(e) => handleInputChange('posted_by', e.target.value)}
                required
              />
            </div>

            {/* Min Read */}
            <div className="space-y-2">
              <Label htmlFor="min_read">Reading Time (minutes) *</Label>
              <Input
                id="min_read"
                type="number"
                placeholder="Enter reading time"
                value={formData.min_read}
                onChange={(e) => handleInputChange('min_read', e.target.value)}
                min="1"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button 
                type="button" 
                onClick={handleSubmit} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Blog'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBlog;