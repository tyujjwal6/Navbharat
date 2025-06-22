"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils"; // Your utility function from shadcn
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { axiosInstance } from "../../baseurl/axiosInstance";

// Import your axios instance

// 1. Define the form schema with Zod
const formSchema = z.object({
  drawName: z.string().min(2, {
    message: "Draw name must be at least 2 characters.",
  }),
  openingDate: z.date({
    required_error: "An opening date is required.",
  }),
});

export function CreateDraw() {
  // State to control the Dialog's open/closed status
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Define the form using react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      drawName: "",
      // openingDate is handled by the calendar's state
    },
  });

  // 3. Define the submit handler
  async function onSubmit(values) {
    setIsSubmitting(true);
    
    try {
      // Prepare the payload with correct field names
      const payload = {
        draw_name: values.drawName,
        opening_date: format(values.openingDate, "yyyy-MM-dd"), // Format date as needed by your API
      };

      console.log("Sending payload:", payload);

      // Make API call using axiosInstance
      const response = await axiosInstance.post('/create-draw', payload);
      
      console.log("Draw created successfully:", response.data);
      
      // After successful submission...
      setOpen(false); // Close the dialog
      form.reset(); // Reset the form fields
      
      // You might want to show a success message or trigger a refresh
      // toast.success("Draw created successfully!"); // if using toast notifications
      
    } catch (error) {
      console.error("Error creating draw:", error);
      
      // Handle error - you might want to show an error message
      // toast.error("Failed to create draw. Please try again."); // if using toast notifications
      
      // Optionally, you can set form errors based on API response
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        Object.keys(error.response.data.errors).forEach((key) => {
          form.setError(key, {
            type: "server",
            message: error.response.data.errors[key][0]
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-700 text-white">
          Create New Draw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create Draw</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new draw. Click create when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Draw Name Field */}
            <FormField
              control={form.control}
              name="drawName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Draw Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Monthly Prize Draw" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Opening Date Field */}
            <FormField
              control={form.control}
              name="openingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Opening Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}