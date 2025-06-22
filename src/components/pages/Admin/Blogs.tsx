"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, X, MapPin, Calendar, User, Pencil } from "lucide-react";
import CreateBlog from "./CreateBlog";
import { axiosInstance } from "../../baseurl/axiosInstance";

// Updated interface to match the new API response
interface Blog {
  blog_id: number;
  title: string;
  subheading: string;
  category: string;
  description: string;
  hashtags: string[];
  image: string; // base64 string
  location: string;
  min_read: string;
  posted_by: string;
  posted_at: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  // State for Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/blog");
      // Assuming the API returns an array of blogs directly
      setBlogs(res.data.data.rows || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      // Optionally, handle the error in the UI
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCardClick = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const handleCloseDetailDialog = () => {
    setSelectedBlog(null);
  };

  const handleOpenDeleteDialog = (e: React.MouseEvent, blogId: number) => {
    e.stopPropagation();
    setBlogToDelete(blogId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (blogToDelete !== null) {
      try {
        await axiosInstance.delete(`/blog/${blogToDelete}`);
        setBlogs(blogs.filter((blog) => blog.blog_id !== blogToDelete));
        setBlogToDelete(null);
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete blog:", error);
      }
    }
  };

  // --- Edit Dialog Functions ---
  const handleOpenEditDialog = (e: React.MouseEvent, blog: Blog) => {
    e.stopPropagation();
    setBlogToEdit(blog);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setBlogToEdit(null);
    setIsEditDialogOpen(false);
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogToEdit) return;

    // The payload should contain only the fields that can be edited.
    // Assuming all text fields are editable.
    const updatedPayload = {
        title: blogToEdit.title,
        subheading: blogToEdit.subheading,
        category: blogToEdit.category,
        description: blogToEdit.description,
        hashtags: blogToEdit.hashtags,
        location: blogToEdit.location,
        min_read: blogToEdit.min_read,
        posted_by: blogToEdit.posted_by
    };

    try {
      const res = await axiosInstance.put(`/blog/${blogToEdit.blog_id}`, updatedPayload);
      // Update the state with the new data from the response
      setBlogs(blogs?.map(b => b.blog_id === blogToEdit.blog_id ? { ...b, ...res.data } : b));
      handleCloseEditDialog();
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!blogToEdit) return;
    const { name, value } = e.target;
    setBlogToEdit({ ...blogToEdit, [name]: name === 'hashtags' ? value.split(',').map(tag => tag.trim()) : value });
  };
  // --- End Edit Dialog Functions ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <CreateBlog refetchBlogs={fetchBlogs} />
        </div>

        {/* Main Blog Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs?.map((blog) => (
              <Card
                key={blog.blog_id}
                className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm border border-gray-200 flex flex-col"
                onClick={() => handleCardClick(blog)}
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 border-0">
                      {blog.category}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <CardTitle className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="mr-3">{blog.location}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{new Date(blog.posted_at).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-4 flex-grow">
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {blog.subheading}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.hashtags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-3 w-3 mr-1" />
                    <span className="mr-3">{blog.posted_by}</span>
                    <span>{blog.min_read} min read</span>
                  </div>
                  <div className="flex gap-1">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                        onClick={(e) => handleOpenEditDialog(e, blog)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={(e) => handleOpenDeleteDialog(e, blog.blog_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Full Screen Blog Detail Dialog */}
        <Dialog open={!!selectedBlog} onOpenChange={(isOpen) => !isOpen && handleCloseDetailDialog()}>
          <DialogContent className="bg-white h-screen w-screen max-w-none flex flex-col p-0 gap-0">
            {selectedBlog && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-30 rounded-full bg-white/80 hover:bg-white shadow-lg"
                  onClick={handleCloseDetailDialog}
                >
                  <X className="h-5 w-5" />
                </Button>

                <header className="relative flex-shrink-0 h-[50vh] w-full overflow-hidden">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </header>

                <main className="flex-grow p-6 md:p-10 overflow-y-auto bg-gray-50">
                  <div className="max-w-4xl mx-auto">
                    <DialogHeader className="text-left mb-8">
                      <div className="flex flex-wrap gap-4 mb-4">
                        <Badge className="bg-blue-600 text-white">{selectedBlog.category}</Badge>
                      </div>
                      <DialogTitle className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                        {selectedBlog.title}
                      </DialogTitle>
                      <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          <span className="font-medium">{selectedBlog.posted_by}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span>{selectedBlog.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>
                            {new Date(selectedBlog.posted_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {selectedBlog.min_read} min read
                        </span>
                      </div>
                      <DialogDescription className="text-xl text-gray-700 leading-relaxed">
                        {selectedBlog.subheading}
                      </DialogDescription>
                    </DialogHeader>

                    <article className="prose prose-lg max-w-none mb-8">
                      <div className="text-gray-800 leading-relaxed space-y-6 whitespace-pre-wrap">
                        {selectedBlog.description}
                      </div>
                    </article>

                    <footer className="border-t pt-6">
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">Tags:</h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedBlog.hashtags.map((tag) => (
                          <Badge key={tag} variant="default" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </footer>
                  </div>
                </main>
              </>
            )}
          </DialogContent>
        </Dialog>

         {/* Edit Blog Dialog */}
         <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => !isOpen && handleCloseEditDialog()}>
            <DialogContent className="sm:max-w-[625px] bg-white">
                 <DialogHeader>
                    <DialogTitle>Edit Blog Post</DialogTitle>
                    <DialogDescription>
                        Make changes to your blog post here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                {blogToEdit && (
                    <form onSubmit={handleUpdateBlog}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input id="title" name="title" value={blogToEdit.title} onChange={handleEditFormChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="subheading" className="text-right">Subheading</Label>
                                <Input id="subheading" name="subheading" value={blogToEdit.subheading} onChange={handleEditFormChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category" className="text-right">Category</Label>
                                <Input id="category" name="category" value={blogToEdit.category} onChange={handleEditFormChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Content</Label>
                                <Textarea id="description" name="description" value={blogToEdit.description} onChange={handleEditFormChange} className="col-span-3" rows={8}/>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="hashtags" className="text-right">Hashtags</Label>
                                <Input id="hashtags" name="hashtags" value={blogToEdit.hashtags.join(', ')} onChange={handleEditFormChange} className="col-span-3" placeholder="tag1, tag2, tag3"/>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input id="location" name="location" value={blogToEdit.location} onChange={handleEditFormChange} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="min_read" className="text-right">Read Time</Label>
                                <Input id="min_read" name="min_read" value={blogToEdit.min_read} onChange={handleEditFormChange} className="col-span-3" placeholder="e.g., 10"/>
                            </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="posted_by" className="text-right">Author</Label>
                                <Input id="posted_by" name="posted_by" value={blogToEdit.posted_by} onChange={handleEditFormChange} className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseEditDialog}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                This action cannot be undone. This will permanently delete the blog post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setBlogToDelete(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete Article
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}