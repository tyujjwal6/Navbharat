import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "../../baseurl/axiosInstance";

const AllotmentDialog = ({ isOpen, user, onClose }) => {
  // Booking Details State
  const [bookingDetails, setBookingDetails] = React.useState({
    developmentCharges: '',
    booking_amount: '',
    project: user?.project,
    area: '',
    allot:user?.allot,
    plc: '',
    payment_plan:user?.payment_plan,
    change_In_payment_plan: '',
    plcAmount: '',
    registrationAmount: '',
    total_cost: user?.total_cost,
    mode: '',
  });

  // Reset form when dialog opens/closes or user changes
  React.useEffect(() => {
    if (isOpen) {
      setBookingDetails({
        developmentCharges: '',
        booking_amount: '',
        project: user?.project,
        area: user.area,
        allot:user.allot,
        plc: '',
        payment_plan: user?.payment_plan,
        change_In_payment_plan: '',
        plcAmount: '',
        registrationAmount: '',
        total_cost:user.total_cost,
        mode: user.mode,
      });
    }
  }, [isOpen, user]);

  const handleInputChange = (field, value) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async() => {
    if (!user) return;

    
await axiosInstance.put(`/draft/${user?.ticket_id}`,{"mode":bookingDetails?.mode,"area":bookingDetails?.area,"total_cost":bookingDetails?.total_cost,"booking_amount":bookingDetails?.booking_amount,"allotment_done":true})
    // Here you would typically make an API call to save the allotment letter data
   
    
    alert(`Allotment letter created successfully for ${user.name}`);
    
    // Close the dialog after saving
    onClose();
  };

 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Create Allotment Letter</DialogTitle>
          <DialogDescription>
            Complete the allotment letter details for User ID: {user?.id || ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Applicant Details Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Applicant Details</h3>
              <p className="text-sm text-gray-600">Personal information of the applicant</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userId" className="text-sm font-medium">User ID</Label>
                <div className="mt-1 font-mono p-2 bg-gray-100 rounded-md text-sm">
                  {user?.id}
                </div>
              </div>
              
              <div>
                <Label htmlFor="userName" className="text-sm font-medium">Name</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
                  {user?.name}
                </div>
              </div>
              
              <div>
                <Label htmlFor="fatherName" className="text-sm font-medium">Father's Name</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
                  {user?.fatherName}
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
                  {user?.phone}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
                  {user?.address}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nationality" className="text-sm font-medium">Nationality</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
                  {user?.nationality || 'Indian'}
                </div>
              </div>
              
              <div>
                <Label htmlFor="aadharNo" className="text-sm font-medium">Aadhar No</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
                  {user?.aadhar || 'XXXX-XXXX-XXXX'}
                </div>
              </div>
              
              <div>
                <Label htmlFor="panNo" className="text-sm font-medium">PAN No</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
                  {user?.pan || 'XXXXXXXXXX'}
                </div>
              </div>
              
              <div>
                <Label htmlFor="profession" className="text-sm font-medium">Occupation</Label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">
                  {user?.occupation || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details Section */}
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <p className="text-sm text-gray-600">Property and payment information</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="developmentCharges" className="text-sm font-medium">Development Charges</Label>
                <Input
                  id="developmentCharges"
                  type="text"
                  placeholder="Enter development charges"
                  value={bookingDetails.developmentCharges}
                  onChange={(e) => handleInputChange('developmentCharges', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="booking_amount" className="text-sm font-medium">Booking Amount</Label>
                <Input
                  id="booking_amount"
                  type="text"
                  placeholder="Enter booking amount"
                  value={bookingDetails.booking_amount}
                  onChange={(e) => handleInputChange('booking_amount', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="project" className="text-sm font-medium">Project</Label>
                <Input
                  id="project"
                  type="text"
                  placeholder="Enter project name"
                  value={bookingDetails.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="area" className="text-sm font-medium">Plot Size</Label>
                <Input
                  id="area"
                  type="text"
                  placeholder="Enter plot size"
                  value={bookingDetails.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="allot" className="text-sm font-medium">Unit No</Label>
                <Input
                  id="allot"
                  type="text"
                  placeholder="Enter unit number"
                  value={bookingDetails.allot}
                  onChange={(e) => handleInputChange('allot', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="plc" className="text-sm font-medium">PLC</Label>
                <Input
                  id="plc"
                  type="text"
                  placeholder="Enter PLC"
                  value={bookingDetails.plc}
                  onChange={(e) => handleInputChange('plc', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="payment_plan" className="text-sm font-medium">Payment Plan</Label>
                <Input
                  id="payment_plan"
                  type="text"
                  placeholder="Enter payment plan"
                  value={bookingDetails.payment_plan}
                  onChange={(e) => handleInputChange('payment_plan', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="change_In_payment_plan" className="text-sm font-medium">Change in Payment Plan</Label>
                <Input
                  id="change_In_payment_plan"
                  type="text"
                  placeholder="Enter changes if any"
                  value={bookingDetails.change_In_payment_plan}
                  onChange={(e) => handleInputChange('change_In_payment_plan', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="plcAmount" className="text-sm font-medium">PLC Amount</Label>
                <Input
                  id="plcAmount"
                  type="text"
                  placeholder="Enter PLC amount"
                  value={bookingDetails.plcAmount}
                  onChange={(e) => handleInputChange('plcAmount', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="registrationAmount" className="text-sm font-medium">Registration Amount</Label>
                <Input
                  id="registrationAmount"
                  type="text"
                  placeholder="Enter registration amount"
                  value={bookingDetails.registrationAmount}
                  onChange={(e) => handleInputChange('registrationAmount', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="total_cost" className="text-sm font-medium">Total Cost</Label>
                <Input
                  id="total_cost"
                  type="text"
                  placeholder="Enter total cost"
                  value={bookingDetails.total_cost}
                  onChange={(e) => handleInputChange('total_cost', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="mode" className="text-sm font-medium">Mode of Payment</Label>
                <Input
                  id="mode"
                  type="text"
                  placeholder="Enter mode of payment"
                  value={bookingDetails.mode}
                  onChange={(e) => handleInputChange('mode', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Generate Allotment Letter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllotmentDialog;