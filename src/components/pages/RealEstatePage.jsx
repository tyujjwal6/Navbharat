import React, { useState } from 'react';

// Import Shadcn/ui Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Import Lucide Icon
import { Phone } from 'lucide-react';

// A small reusable component for the stat cards. Can be kept in the same file.
const StatCard = ({ value, label }) => (
  <Card className="bg-[#FDE8D4] border-0 shadow-none text-center rounded-2xl">
    <CardContent className="flex flex-col justify-center items-center p-6 h-full">
      <p className="text-4xl md:text-5xl font-bold text-slate-800">{value}</p>
      <p className="mt-2 text-base text-slate-600">{label}</p>
    </CardContent>
  </Card>
);

export default function RealEstatePage() {
  // State for form fields
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // We no longer need event.preventDefault()
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = {
      propertyType,
      budget,
      location,
    };

    // Simple validation
    if (!budget || !location) {
        alert('Please fill out budget and location fields.');
        setIsSubmitting(false);
        return;
    }
    
    console.log("Submitting form data to dummy API:", formData);

    try {
      // Hitting a dummy API endpoint to simulate a backend call
      const response = await fetch('https://dummyjson.com/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Real Estate Search Inquiry',
          userId: 5, // Example user ID
          ...formData,
        }),
      });
      const result = await response.json();
      console.log('Dummy API Response:', result);
      alert(`Search submitted successfully! Check the browser console for the data sent and the API response.`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the search. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full font-sans">
      
      <div className="bg-gray-50/50 border-b border-gray-200">
        <div className="container mx-auto px-4 pt-8 pb-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="propertyType" className="font-semibold text-green-700">Property Type</Label>
                <Input
                  id="propertyType"
                  type="text"
                  placeholder="Plot, Villa, etc."
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="budget" className="font-semibold text-green-700">Budget</Label>
                 <Select onValueChange={setBudget} value={budget}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select Budget" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="<50L">Under ₹50 Lakh</SelectItem>
                        <SelectItem value="50L-1Cr">₹50 Lakh - ₹1 Crore</SelectItem>
                        <SelectItem value="1Cr-2Cr">₹1 Crore - ₹2 Crore</SelectItem>
                        <SelectItem value=">2Cr">Above ₹2 Crore</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="location" className="font-semibold text-green-700">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white"
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 lg:col-span-1">
                {isSubmitting ? 'Searching...' : 'Search Properties'}
              </Button>

            </div>
          </form>
        </div>
      </div>
      
      <main className="container mx-auto px-4">
        <section className="text-center my-16 md:my-20 max-w-4xl mx-auto">
          <p className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
            We at <span className="font-bold">NavBharat Niwas</span> 🏡 are proud to serve you with the best and most affordable plots and homes across India 🇮🇳. Whether you're looking for residential, commercial, or investment opportunities — we've got you covered! ✅ Our properties are government-verified, legally clear, and delivered with trust and transparency 🤝. Join hands with one of the top builders in India and take a confident step toward your dream home today! ✨
          </p>
        </section>
        
        <section className="bg-gray-100/70 p-6 md:p-10 rounded-2xl mb-16 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard value="4+" label="States Covered" />
                <StatCard value="200+" label="Trusted Clients" />
                <StatCard value="25+" label="Our Team" />
                <StatCard value="7+ years" label="Experience" />
            </div>
            <div >
                <div className="image-container">
                    <img src="./src/assets/buildingfuture.png" alt="" />
                        <button 
          className="enquire-now-button"
          onClick={openModal}
        >
          Enquire Now →
        </button>
            
                </div>
            </div>

    
           
        </section>
      </main>
    </div>
  );
}