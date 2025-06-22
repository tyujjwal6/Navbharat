"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Youtube, MapPin, IndianRupee, Building2, Layers, ChevronDown, ChevronRight, Eye, Edit2, Save, X, Plus, Trash2, Upload, Loader2, TestTube2, BadgeCheck, Zap } from "lucide-react";
import AddSite from "./AddSite";
import { axiosInstance } from "../../baseurl/axiosInstance";

// --- Mock UI Components ---
// (Your existing mock components remain here)
const Table = ({ children, className = "" }) => <div className={`w-full ${className}`}>{children}</div>;
const TableHeader = ({ children }) => <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">{children}</div>;
const TableBody = ({ children }) => <div className="divide-y divide-slate-100">{children}</div>;
const TableRow = ({ children, onClick, className = "" }) => <div onClick={onClick} className={`transition-all duration-200 ${className}`}>{children}</div>;
const TableHead = ({ children, className = "" }) => <div className={`px-6 py-4 text-left text-sm font-semibold text-slate-700 ${className}`}>{children}</div>;
const TableCell = ({ children, className = "" }) => <div className={`px-6 py-4 text-sm text-slate-600 ${className}`}>{children}</div>;
const Card = ({ children, className = "" }) => <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="px-6 py-5 border-b border-slate-100">{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-lg font-semibold text-slate-900">{children}</h3>;
const CardDescription = ({ children }) => <p className="mt-2 text-sm text-slate-600 leading-relaxed">{children}</p>;
const CardContent = ({ children, className = "" }) => <div className={`px-6 py-5 ${className}`}>{children}</div>;
const CardFooter = ({ children }) => <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">{children}</div>;
const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const variants = { default: "bg-slate-900 text-white hover:bg-slate-800", outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50", ghost: "text-slate-600 hover:bg-slate-100", destructive: "bg-red-600 text-white hover:bg-red-700" };
  const sizes = { default: "px-4 py-2", sm: "px-3 py-1.5 text-xs", icon: "p-2" };
  return <button className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};
const Input = ({ className = "", ...props }) => <input className={`flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
const Textarea = ({ className = "", ...props }) => <textarea className={`flex min-h-[80px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
const Label = ({ children, className = "", ...props }) => <label className={`text-sm font-medium text-slate-700 ${className}`} {...props}>{children}</label>;
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in-0"><div className="fixed inset-0" onClick={onClose} /><div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">{children}</div></div>);
};
// Slightly improved mock Select for Modal functionality
const Select = ({ children, ...props }) => <div className="relative" {...props}>{children}</div>;
const SelectTrigger = React.forwardRef(({ children, ...props }, ref) => <button ref={ref} className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props}>{children}</button>);
const SelectValue = ({ children, ...props }) => <span {...props}>{children}</span>;
const SelectContent = ({ children, className = "", ...props }) => <div className={`absolute z-50 min-w-[8rem] w-full mt-1 overflow-hidden rounded-md border bg-white text-slate-900 shadow-md animate-in fade-in-80 ${className}`} {...props}><div className="p-1">{children}</div></div>;
const SelectItem = ({ children, onSelect, ...props }) => <div className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 hover:bg-slate-100" onClick={onSelect} {...props}>{children}</div>;


// --- Helper Functions and Components ---

// Reusable Badge component for displaying status and other details
const Badge = ({ children, variant = "default" }) => {
    const variants = {
      default: "bg-emerald-100 text-emerald-800 border-emerald-200",
      destructive: "bg-red-100 text-red-800 border-red-200",
      premium: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
      outline: "bg-slate-100 text-slate-600 border-slate-300"
    };
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>{children}</span>;
};

// Reusable component for array inputs in forms
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
      <Label className="font-medium text-slate-700">{label}</Label>
      <div className="flex items-center space-x-2">
        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={disabled} />
        <Button type="button" onClick={handleAddItem} disabled={disabled || !inputValue.trim()} size="icon" variant="outline"><Plus className="w-4 h-4" /></Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center bg-gray-100 text-gray-800 text-xs font-medium pl-3 pr-2 py-1 rounded-full">
              <span>{item}</span>
              <button type="button" onClick={() => handleRemoveItem(item)} className="ml-2 text-gray-500 hover:text-red-600 disabled:opacity-50" disabled={disabled}><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Data Transformation & Main Component ---

const transformApiToSiteData = (apiSite) => {
  let statusText, statusVariant, statusIcon;
  switch (apiSite.status) {
    case 'ongoing': statusText = 'Ongoing'; statusVariant = 'default'; statusIcon = <BadgeCheck className="w-3 h-3 mr-1.5" />; break;
    case 'upcoming': statusText = 'Upcoming'; statusVariant = 'premium'; statusIcon = <Zap className="w-3 h-3 mr-1.5" />; break;
    case 'testimonial': statusText = 'Testimonial'; statusVariant = 'outline'; statusIcon = <TestTube2 className="w-3 h-3 mr-1.5" />; break;
    default: statusText = 'Sold Out'; statusVariant = 'destructive'; statusIcon = <X className="w-3 h-3 mr-1.5" />; break;
  }
  
  return {
    id: apiSite.pro_id.toString(),
    siteName: apiSite.name,
    youtubeLink: apiSite.yout_link,
    drawCharges: (apiSite.draw_charges || 0).toLocaleString(),
    state: apiSite.state,
    city: apiSite.city,
    units: parseInt(apiSite.units, 10) || 0,
    description: apiSite.des,
    status: apiSite.status || 'testimonial',
    statusText, statusVariant, statusIcon,
    image: apiSite.image || '',
    // FIX: Directly use the arrays from the API, providing an empty array as a fallback.
    paymentPlan: apiSite.payment_plan || [],
    plotSizes: apiSite.plot_sizes || [],
    preferences: apiSite.prefer || [],
    lastUpdated: apiSite.created_at,
  };
};

export default function AllSites() {
  const [sitesData, setSitesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const fetchSites = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/sites");
      const apiSites = res.data?.data?.rows || [];
      setSitesData(apiSites.map(transformApiToSiteData));
    } catch (error) {
      console.error("Failed to fetch sites data:", error);
      alert("Could not load site data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSites(); }, []);

  const handleRowClick = (id) => setExpandedRow(expandedRow === id ? null : id);

  const handleEditClick = (site, e) => {
    e.stopPropagation();
    setEditingRow(site.id);
    setEditFormData({
      ...site,
      drawCharges: site.drawCharges.replace(/,/g, ''),
    });
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingRow(null);
    setEditFormData({});
  };

  const handleInputChange = (field, value) => setEditFormData(prev => ({ ...prev, [field]: value }));
  const handleArrayChange = (field, newArray) => setEditFormData(prev => ({ ...prev, [field]: newArray }));

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image size should be less than 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => handleInputChange('image', e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      // FIX: The payload now sends arrays directly, matching the API format.
      // It also ensures types match what the API likely expects (numbers for charges, strings for units).
      const payload = {
        name: editFormData.siteName,
        yout_link: editFormData.youtubeLink,
        draw_charges: Number(editFormData.drawCharges) || 0,
        state: editFormData.state,
        city: editFormData.city,
        units: String(editFormData.units || 0),
        des: editFormData.description,
        status: editFormData.status,
        image: editFormData.image,
        payment_plan: editFormData.paymentPlan || [],
        plot_sizes: editFormData.plotSizes || [],
        prefer: editFormData.preferences || [],
      };

      await axiosInstance.put(`/site/${editingRow}`, payload);
      alert('Site updated successfully!');
      handleCancelEdit();
      fetchSites();
    } catch (error) {
      console.error("Failed to update site:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to update site."}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">All Sites</h1>
              <p className="mt-2 text-slate-600">Manage your collection of sites.</p>
            </div>
            <AddSite onSiteAdded={fetchSites} />
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <div className="grid grid-cols-12 gap-4">
                <TableHead className="col-span-4">Site Name</TableHead>
                <TableHead className="col-span-3">Location</TableHead>
                <TableHead className="col-span-2 text-center">Units</TableHead>
                <TableHead className="col-span-2 text-center">Status</TableHead>
                <TableHead className="col-span-1 text-right">Actions</TableHead>
              </div>
            </TableHeader>
            <TableBody>
              {loading ? ( <TableRow><TableCell className="text-center col-span-12 py-10"><Loader2 className="mx-auto h-8 w-8 text-slate-400 animate-spin" /><p className="mt-2 text-slate-500">Loading sites...</p></TableCell></TableRow> )
              : sitesData.length === 0 ? ( <TableRow><TableCell className="text-center col-span-12 py-10"><Building2 className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-2 font-semibold text-slate-700">No sites found.</p><p className="text-sm text-slate-500">Click "Add New Site" to get started.</p></TableCell></TableRow> )
              : (
                sitesData.map((site) => (
                <React.Fragment key={site.id}>
                  <TableRow onClick={() => handleRowClick(site.id)} className={`cursor-pointer group ${expandedRow === site.id ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                    <div className="grid grid-cols-12 gap-4 items-center py-4">
                      <TableCell className="col-span-4"><div className="flex items-center space-x-4"><img src={site.image || `https://ui-avatars.com/api/?name=${site.siteName.charAt(0)}&background=e2e8f0&color=64748b&bold=true`} alt={site.siteName} className="w-12 h-12 rounded-lg object-cover bg-slate-200"/><div><div className="font-semibold text-slate-900">{site.siteName}</div><div className="text-xs text-slate-500 mt-1">ID: {site.id}</div></div></div></TableCell>
                      <TableCell className="col-span-3"><div className="flex items-center space-x-2"><MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" /><span>{`${site.city}, ${site.state}`}</span></div></TableCell>
                      <TableCell className="col-span-2 text-center font-medium">{site.units}</TableCell>
                      <TableCell className="col-span-2 text-center"><Badge variant={site.statusVariant}>{site.statusIcon}{site.statusText}</Badge></TableCell>
                      <TableCell className="col-span-1 text-right"><div className="flex items-center justify-end space-x-1"><Button variant="ghost" size="icon" onClick={(e) => handleEditClick(site, e)} className="hover:bg-blue-50 hover:text-blue-600"><Edit2 className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="transition-transform duration-200">{expandedRow === site.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}</Button></div></TableCell>
                    </div>
                  </TableRow>
                  {expandedRow === site.id && (
                     <TableRow className="bg-slate-50"><td colSpan="12" className="p-0"><div className="p-6">
                        <CardDescription>{site.description || "No description provided."}</CardDescription>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <DetailSection title="Payment Plans" items={site.paymentPlan} icon={<IndianRupee className="w-4 h-4 text-slate-500" />}/>
                            <DetailSection title="Available Plot Sizes" items={site.plotSizes} icon={<Layers className="w-4 h-4 text-slate-500" />}/>
                            <DetailSection title="Highlights" items={site.preferences} icon={<Building2 className="w-4 h-4 text-slate-500" />}/>
                        </div>
                     </div></td></TableRow>
                  )}
                </React.Fragment>
              )))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={handleCancelEdit}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-6"><h2 className="text-2xl font-bold text-slate-900">Edit Site: {editFormData.siteName}</h2><Button variant="ghost" size="icon" onClick={handleCancelEdit}><X className="w-5 h-5" /></Button></div>
          <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
            <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="edit-siteName">Site Name *</Label><Input id="edit-siteName" value={editFormData.siteName || ""} onChange={(e) => handleInputChange("siteName", e.target.value)} disabled={isSaving} /></div><div className="space-y-2"><Label htmlFor="edit-youtubeLink">YouTube Link</Label><Input id="edit-youtubeLink" value={editFormData.youtubeLink || ""} onChange={(e) => handleInputChange("youtubeLink", e.target.value)} disabled={isSaving} /></div></div>
            <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="edit-state">State *</Label><Input id="edit-state" value={editFormData.state || ""} onChange={(e) => handleInputChange("state", e.target.value)} disabled={isSaving} /></div><div className="space-y-2"><Label htmlFor="edit-city">City *</Label><Input id="edit-city" value={editFormData.city || ""} onChange={(e) => handleInputChange("city", e.target.value)} disabled={isSaving} /></div></div>
            <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="edit-units">Units</Label><Input type="number" id="edit-units" value={editFormData.units || ""} onChange={(e) => handleInputChange("units", e.target.value)} disabled={isSaving} /></div><div className="space-y-2"><Label htmlFor="edit-drawCharges">Draw Charges</Label><Input type="number" id="edit-drawCharges" value={editFormData.drawCharges || ""} onChange={(e) => handleInputChange("drawCharges", e.target.value)} disabled={isSaving} /></div></div>
            <div className="space-y-2"><Label htmlFor="edit-current">Current Status *</Label><Select><SelectTrigger id="edit-current">{(editFormData.status || "Select Status").charAt(0).toUpperCase() + (editFormData.status || "Select Status").slice(1)}<ChevronDown className="w-4 h-4 opacity-50" /></SelectTrigger><SelectContent className="bg-white"><SelectItem onSelect={() => handleInputChange('status', 'testimonial')}>Testimonial</SelectItem><SelectItem onSelect={() => handleInputChange('status', 'ongoing')}>Ongoing</SelectItem><SelectItem onSelect={() => handleInputChange('status', 'upcoming')}>Upcoming</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="edit-description">Description</Label><Textarea id="edit-description" value={editFormData.description || ""} onChange={(e) => handleInputChange("description", e.target.value)} rows={3} disabled={isSaving} /></div>
            
            <ArrayInput label="Payment Plans" placeholder="Add a payment plan (e.g., 24 Months EMI)" items={editFormData.paymentPlan || []} setItems={(newItems) => handleArrayChange('paymentPlan', newItems)} disabled={isSaving} />
            <ArrayInput label="Plot Sizes" placeholder="Add a plot size (e.g., 100 sq yards)" items={editFormData.plotSizes || []} setItems={(newItems) => handleArrayChange('plotSizes', newItems)} disabled={isSaving} />
            <ArrayInput label="Preferences / Highlights" placeholder="Add a highlight (e.g., Gated Community)" items={editFormData.preferences || []} setItems={(newItems) => handleArrayChange('preferences', newItems)} disabled={isSaving} />

            <div className="space-y-2"><Label>Image</Label>{!editFormData.image ? (<div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="edit-imageUpload" disabled={isSaving} /><label htmlFor="edit-imageUpload" className="cursor-pointer"><Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" /><p>Click to upload</p></label></div>) : (<div className="relative mt-1 w-48"><img src={editFormData.image} alt="Preview" className="w-full h-28 object-cover rounded-lg" /><Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-7 w-7 rounded-full" onClick={() => handleInputChange('image', '')} disabled={isSaving}><X className="w-4 h-4" /></Button></div>)}</div>
          </div>
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200"><Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>Cancel</Button><Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 w-36" disabled={isSaving}>{isSaving ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>) : (<><Save className="w-4 h-4 mr-2" /> Save Changes</>)}</Button></div>
        </div>
      </Modal>
    </div>
  );
}

const DetailSection = ({ title, items, icon }) => {
    if (!items || items.length === 0) return (
        <div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">{icon} <span className="ml-2">{title}</span></h4>
            <p className="text-xs text-slate-500">No {title.toLowerCase()} specified.</p>
        </div>
    );
    return (
      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">{icon} <span className="ml-2">{title}</span></h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => <Badge key={index} variant="outline">{item}</Badge>)}
        </div>
      </div>
    );
};