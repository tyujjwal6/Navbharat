// This component uses client-side hooks, so we need to mark it as a client component.
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Wallet, Search, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, CheckCircle2, Landmark, Users, Briefcase, Calendar, Youtube, ArrowRight, Clock, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'
import { axiosInstance } from '../baseurl/axiosInstance';

// --- API DATA TRANSFORMATION ---
const transformApiToProjectData = (apiSite) => {
  // Create budget range based on draw_charges
  const drawCharges = apiSite.draw_charges || 0;
  let budget;
  if (drawCharges <= 500000) {
    budget = 'Under 5L';
  } else if (drawCharges <= 1000000) {
    budget = '5L-10L';
  } else if (drawCharges <= 2000000) {
    budget = '10L-20L';
  } else {
    budget = '20L+';
  }

  // Determine property type based on plot sizes or preferences
  let type = 'Plot';
  if (apiSite.prefer && apiSite.prefer.length > 0) {
    const preferences = apiSite.prefer.join(' ').toLowerCase();
    if (preferences.includes('apartment') || preferences.includes('flat')) {
      type = 'Apartment';
    } else if (preferences.includes('villa')) {
      type = 'Villa';
    } else if (preferences.includes('house')) {
      type = 'House';
    } else if (preferences.includes('commercial')) {
      type = 'Commercial';
    }
  }

  return {
    id: apiSite.pro_id,
    name: apiSite.name,
    location: `${apiSite.city}, ${apiSite.state}`,
    budget: budget,
    image: apiSite.image || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    type: type,
    status: apiSite.status,
    drawCharges: apiSite.draw_charges,
    city: apiSite.city,
    state: apiSite.state,
    units: apiSite.units,
    description: apiSite.des,
    paymentPlan: apiSite.payment_plan || [],
    plotSizes: apiSite.plot_sizes || [],
    preferences: apiSite.prefer || [],
    youtubeLink: apiSite.yout_link
  };
};

const transformApiBlogData = (apiBlog) => {
  return {
    id: apiBlog.blog_id,
    title: apiBlog.title,
    excerpt: apiBlog.subheading,
    image: apiBlog.image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: apiBlog.posted_by,
    date: new Date(apiBlog.posted_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readTime: `${apiBlog.min_read} min read`,
    category: apiBlog.category,
    description: apiBlog.description,
    hashtags: apiBlog.hashtags || [],
    location: apiBlog.location
  };
};

// --- PARTICLE SYSTEM COMPONENT ---
const ParticleSystem = ({ density = 50, speed = 0.5, color = 'rgba(99, 102, 241, 0.1)' }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    particles.current = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = color.replace('0.1', particle.opacity.toString());
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [density, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// --- FLOATING SHAPES COMPONENT ---
const FloatingShapes = ({ count = 6 }) => {
  const shapes = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {shapes.map(shape => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 opacity-20"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// --- REUSABLE ANIMATION WRAPPER ---
const AnimatedSection = ({ children, className = '', id = '', withParticles = false, withShapes = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`py-20 px-4 md:px-8 relative ${className}`}
    >
      {withParticles && <ParticleSystem />}
      {withShapes && <FloatingShapes />}
      <div className="relative z-10">
        {children}
      </div>
    </motion.section>
  );
};

// --- MAIN LANDING PAGE COMPONENT ---
export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  
  // API State
  const [allProjectsData, setAllProjectsData] = useState([]);
  const [ongoingProjectsData, setOngoingProjectsData] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects data from API
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/sites");
      const apiSites = response.data?.data?.rows || [];
      
      // Transform API data
      const transformedProjects = apiSites.map(transformApiToProjectData);
      
      // Set all projects
      setAllProjectsData(transformedProjects);
      
      // Filter ongoing projects (status: 'ongoing' or 'upcoming')
      const ongoingProjects = transformedProjects
        .filter(project => project.status === 'ongoing' || project.status === 'upcoming')
        .map(project => ({
          id: project.id,
          name: project.name,
          location: project.location,
          status: project.status === 'ongoing' ? 'Under Construction' : 
                  project.status === 'upcoming' ? 'Upcoming Launch' : 'In Progress',
          image: project.image
        }));
      
      setOngoingProjectsData(ongoingProjects);
      
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch blogs data from API
  const fetchBlogs = async () => {
    setBlogLoading(true);
    try {
      const response = await axiosInstance.get("/blog");
      const apiBlogs = response.data?.data?.rows || [];
      
      // Transform API data and get latest 3 blogs
      const transformedBlogs = apiBlogs
        .map(transformApiBlogData)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
      
      setBlogPosts(transformedBlogs);
      
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      // Keep empty array on error, component will handle gracefully
    } finally {
      setBlogLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProjects();
    fetchBlogs();
  }, []);

  // Filter projects based on search criteria
  const filteredProjects = allProjectsData.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = location === '' || location === 'all' || 
                           project.city === location || project.state === location;
    const matchesBudget = budget === '' || budget === 'all' || project.budget === budget;
    
    return matchesSearch && matchesLocation && matchesBudget;
  });

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(allProjectsData.flatMap(project => [project.city, project.state]))];

  const isauth = localStorage.getItem("isAuthenticated");

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchProjects} className="bg-indigo-600 hover:bg-indigo-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header isauth={isauth} />
      <main>
        <HeroSection />
        <AboutUsSection />
        <AllProjectsSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          location={location}
          setLocation={setLocation}
          budget={budget}
          setBudget={setBudget}
          filteredProjects={filteredProjects}
          uniqueLocations={uniqueLocations}
          loading={loading}
        />
        <OngoingProjectsSection 
          ongoingProjectsData={ongoingProjectsData}
          loading={loading}
        />
        <BlogSection 
          blogPosts={blogPosts}
          loading={blogLoading}
        />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}

// --- HEADER & NAVLINK COMPONENTS ---
const NavLink = ({ children, href }) => (
  <motion.a
    href={href}
    className="relative text-gray-600 hover:text-indigo-600 transition-colors py-2 text-lg"
    whileHover="hover"
    initial="initial"
  >
    {children}
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
      variants={{
        initial: { scaleX: 0, originX: 0.5 },
        hover: { scaleX: 1, originX: 0.5 }
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  </motion.a>
);

const Header = ({isauth}) => (
  <motion.header 
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300"
  >
    <div className="container mx-auto px-4 md:px-8 flex justify-between items-center h-20">
      <motion.a 
        href="#"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src="https://navbharatniwas.in/assets/blcklogo-CGNpodye.png" alt="Navbharat Niwas Logo" className='w-auto h-20'/>
      </motion.a>
      <nav className="hidden md:flex gap-10 items-center">
        {isauth &&
        <NavLink href="/dashboard-user">DashBoard</NavLink>
        }
        <NavLink href="#about">About Us</NavLink>
        <NavLink href="#projects">Projects</NavLink>
        <NavLink href="#blog">Blog</NavLink>
        <NavLink href="#contact">Contact</NavLink>
      </nav>

      <div className="flex items-center gap-2 md:gap-4">
        {!isauth && (
          <>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={'/login'}>
                <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">Login</Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={'/register'}>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">Register</Button>
              </Link>
            </motion.div>
          </>
        )}
        
        {isauth && (
          <div className="md:hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/dashboard-user">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                  Dashboard
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  </motion.header>
);

// --- HERO SECTION COMPONENT ---
const HeroSection = () => {
  const [isIntroDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const introWords = ["Find.", "Your.", "Dream.", "Home."];
  const introContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.4, delayChildren: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
  };
  const introWordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } },
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
      <video
        src="https://videos.pexels.com/video-files/8964796/8964796-uhd_2560_1440_25fps.mp4"
        autoPlay loop muted playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
      
      <div className="relative z-20 text-center">
        {!isIntroDone ? (
          <motion.div
            key="intro" variants={introContainerVariants} initial="hidden" animate="visible" exit="exit"
            className="flex gap-4 md:gap-8 text-5xl md:text-8xl font-extrabold"
          >
            {introWords.map((word, i) => (
              <motion.span 
                key={i} 
                variants={introWordVariants} 
                className="inline-block tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-4"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                background: "linear-gradient(45deg, #ffffff, #a5b4fc, #ffffff, #c7d2fe)",
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Your Journey to the Perfect Home Begins Here
            </motion.h1>
            <motion.p 
              className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Discover exceptional properties with unparalleled service and expertise.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.a 
                href="#projects" 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full shadow-2xl border border-white/20">
                  Explore Properties
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-2"
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </Button>
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// --- ABOUT US SECTION ---
const AboutUsSection = () => (
  <AnimatedSection id="about" className="bg-gray-50" withParticles={true} withShapes={true}>
    <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
      <motion.div 
        whileHover={{ scale: 1.03, rotateY: 5 }} 
        transition={{ type: "spring", stiffness: 300 }}
        className="relative"
      >
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-20 blur-lg"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <img 
          src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
          alt="Modern House" 
          className="rounded-lg shadow-2xl w-full h-auto object-cover relative z-10" 
        />
      </motion.div>
      <div className="text-left">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Navbharat Niwas</span>
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 mb-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          For over 7 years, Navbharat Niwas has been a cornerstone in the real estate market, dedicated to helping people find not just a house, but a place to call home.
        </motion.p>
        <motion.ul 
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            { title: "Trust & Transparency", desc: "Our philosophy is built on a foundation of honesty and clear communication." },
            { title: "Expert Team", desc: "Our 25+ dedicated professionals operate across 4 states, combining local expertise with a broad network." },
            { title: "Seamless Experience", desc: "We leverage cutting-edge technology and personalized service to make your journey successful." }
          ].map((item, index) => (
            <motion.li 
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ x: 10 }}
            >
              <CheckCircle2 className="h-6 w-6 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
              <span className="text-lg text-gray-600">
                <strong>{item.title}:</strong> {item.desc}
              </span>
            </motion.li>
          ))}
        </motion.ul>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
            Learn More
          </Button>
        </motion.div>
      </div>
    </div>
  </AnimatedSection>
);

// --- ALL PROJECTS SECTION ---
const AllProjectsSection = ({ searchTerm, setSearchTerm, location, setLocation, budget, setBudget, filteredProjects, uniqueLocations, loading }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" } }
  };

  return (
    <AnimatedSection id="projects" withParticles={true}>
      <div className="container mx-auto text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Projects</span>
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Explore our curated collection of properties. Use the filters below to find exactly what you're looking for.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="mb-12 p-6 bg-white/80 backdrop-blur-sm shadow-xl border border-indigo-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-50" />
            <div className="relative z-10 grid md:grid-cols-4 gap-4 items-end">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search by project name..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-10 h-12 border-indigo-200 focus:border-indigo-500 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <Select onValueChange={setLocation} value={location}>
                  <SelectTrigger className="h-12 border-indigo-200 focus:border-indigo-500">
                    <MapPin className="inline-block mr-2 text-indigo-400"/>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select onValueChange={setBudget} value={budget}>
                  <SelectTrigger className="h-12 border-indigo-200 focus:border-indigo-500">
                    <Wallet className="inline-block mr-2 text-indigo-400"/>
                    <SelectValue placeholder="All Budgets" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Budgets</SelectItem>
                    <SelectItem value="Under 5L">Under ₹5L</SelectItem>
                    <SelectItem value="5L-10L">₹5L - ₹10L</SelectItem>
                    <SelectItem value="10L-20L">₹10L - ₹20L</SelectItem>
                    <SelectItem value="20L+">₹20L+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                  Search Properties
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
            <span className="text-gray-600">Loading projects...</span>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div 
                  key={project.id} 
                  variants={itemVariants} 
                  whileHover={{ y: -12, scale: 1.03, rotateY: 2 }} 
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 blur-lg"
                    whileHover={{ opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                  <Card className="overflow-hidden h-full flex flex-col group shadow-xl hover:shadow-2xl transition-all duration-500 border-0 relative z-10 bg-white/90 backdrop-blur-sm">
                    <div className="relative overflow-hidden">
                      <motion.img 
                        src={project.image} 
                        alt={project.name} 
                        className="w-full h-56 object-cover transition-transform duration-500" 
                        whileHover={{ scale: 1.1 }}
                      />
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {project.type}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold group-hover:text-indigo-600 transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="flex items-center text-gray-500 pt-1">
                        <MapPin className="h-4 w-4 mr-2 text-indigo-400" /> {project.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end">
                      <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {project.budget}
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-300">
                          View Details
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.p 
                className="md:col-span-3 text-gray-500 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No projects match your criteria.
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </AnimatedSection>
  );
};

// --- ONGOING PROJECTS SECTION ---
const OngoingProjectsSection = ({ ongoingProjectsData, loading }) => (
  <AnimatedSection className="bg-gradient-to-br from-indigo-50 to-purple-50" withParticles={true}>
    <div className="container mx-auto text-center">
      <motion.h2 
        className="text-4xl md:text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Ongoing <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Projects</span>
      </motion.h2>
      <motion.p 
        className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Get a glimpse into the future of living. These properties are currently under development.
      </motion.p>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
          <span className="text-gray-600">Loading ongoing projects...</span>
        </div>
      ) : ongoingProjectsData.length === 0 ? (
        <p className="text-gray-500 text-lg">No ongoing projects at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {ongoingProjectsData.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2, type: "spring" }}
              whileHover={{ y: -12, scale: 1.03, rotateX: 5 }}
              className="relative group"
            >
              <motion.div
                className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 blur-lg"
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              />
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full bg-white/90 backdrop-blur-sm border-0 relative z-10">
                <div className="relative overflow-hidden">
                  <motion.img 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-56 object-cover transition-transform duration-500" 
                    whileHover={{ scale: 1.1 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6 text-left">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-500 mb-3 flex items-center">
                    <MapPin size={16} className="mr-2 text-indigo-400"/>{project.location}
                  </p>
                  <motion.span 
                    className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    {project.status}
                  </motion.span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  </AnimatedSection>
);

// --- BLOG SECTION ---
const BlogSection = ({ blogPosts, loading }) => (
  <AnimatedSection id="blog" className="bg-white" withParticles={true} withShapes={true}>
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Latest from Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Blog</span>
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Stay updated with the latest trends, tips, and insights from the real estate world.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-2" />
          <span className="text-gray-600">Loading blog posts...</span>
        </div>
      ) : blogPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <motion.div
                  className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 blur-lg"
                  whileHover={{ opacity: 0.15 }}
                  transition={{ duration: 0.3 }}
                />
                <Card className="overflow-hidden h-full shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm relative z-10">
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-500"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {post.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <div className="flex items-center">
                        <User size={14} className="mr-1 text-indigo-400" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-indigo-400" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-indigo-400" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <motion.div 
                      className="flex items-center text-indigo-600 font-semibold cursor-pointer group-hover:text-purple-600 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      Read More 
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-2"
                      >
                        <ArrowRight size={16} />
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8 py-3"
              >
                View All Articles
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  </AnimatedSection>
);

// --- STATS SECTION WITH PARALLAX ---
const StatsSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className="relative py-24 px-4 bg-gray-800 text-white overflow-hidden">
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`, 
          backgroundPosition: "center", 
          backgroundSize: "cover", 
          y 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 z-10" />

      <div className="container mx-auto relative z-20 text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-12 text-white"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Journey in <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Numbers</span>
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value={4} label="States Covered" suffix="+" Icon={Landmark} />
          <StatCard value={200} label="Happy Clients" suffix="+" Icon={Users} />
          <StatCard value={25} label="Team Members" suffix="+" Icon={Briefcase} />
          <StatCard value={7} label="Years of Experience" suffix="+" Icon={Calendar} />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ value, label, suffix = "", Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5, ease: "easeOut",
        onUpdate(latest) { setDisplayValue(Math.floor(latest)); }
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <motion.div 
      ref={ref}
      className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 relative overflow-hidden"
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
      }}
      transition={{ type: "spring", stiffness: 300 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative z-10">
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <Icon className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
        </motion.div>
        <motion.h3 
          className="text-4xl md:text-6xl font-extrabold text-white mb-2"
          animate={{ 
            textShadow: ["0 0 10px rgba(99, 102, 241, 0.5)", "0 0 20px rgba(99, 102, 241, 0.8)", "0 0 10px rgba(99, 102, 241, 0.5)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {displayValue}{suffix}
        </motion.h3>
        <p className="text-lg text-gray-300">{label}</p>
      </div>
    </motion.div>
  );
};

// --- FOOTER COMPONENT ---
const Footer = () => (
  <footer id="contact" className="bg-gray-900 text-gray-300 pt-16 pb-8 relative overflow-hidden">
    <ParticleSystem density={30} speed={0.3} color="rgba(99, 102, 241, 0.05)" />
    <div className="container mx-auto px-4 md:px-8 relative z-10">
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, staggerChildren: 0.2 }}
      >
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
          <motion.img 
            src={logo} 
            className='h-28 w-auto mb-4'
            whileHover={{ scale: 1.05 }}
          />
          <p className="text-gray-400 leading-relaxed">
            Your trusted partner in finding the perfect property. We are committed to excellence and customer satisfaction.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              { name: "About Us", href: "#about" },
              { name: "Projects", href: "#projects" },
              { name: "Blog", href: "#blog" },
              { name: "Careers", href: "#" }
            ].map((link, index) => (
              <li key={index}>
                <motion.a 
                  href={link.href} 
                  whileHover={{ x: 5, color: "#a5b4fc" }} 
                  className="hover:text-indigo-400 transition-colors inline-block"
                >
                  {link.name}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Contact Us
          </h3>
          <ul className="space-y-3 text-gray-400">
            {[
              { icon: MapPin, text: "Sector 63, Noida, Uttar Pradesh - 208003" },
              { icon: Phone, text: "+919971488477" },
              { icon: Mail, text: "support@navbharatniwas.in" }
            ].map((contact, index) => (
              <motion.li 
                key={index}
                className="flex items-start"
                whileHover={{ x: 5, color: "#a5b4fc" }}
              >
                <contact.icon size={16} className="mr-3 mt-1 text-indigo-400 flex-shrink-0" />
                {contact.text}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            {[
              { icon: Facebook, href: "https://www.facebook.com/people/NavBharat-Niwas/61572183777309/" },
              { icon: Instagram, href: "https://www.instagram.com/navbharatniwas/" },
              { icon: Youtube, href: "https://www.youtube.com/@NavBharatNiwas" }
            ].map((social, index) => (
              <motion.a 
                key={index}
                href={social.href} 
                whileHover={{ 
                  y: -5, 
                  scale: 1.2, 
                  color: "#a5b4fc",
                  boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)"
                }} 
                className="text-gray-400 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <social.icon size={24}/>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="border-t border-gray-700 pt-8 text-center text-gray-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <p>© {new Date().getFullYear()} Navbharat Niwas. All rights reserved.</p>
      </motion.div>
    </div>
  </footer>
);