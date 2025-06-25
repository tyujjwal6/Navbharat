import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, ArrowLeft, Shield, CheckCircle2, AlertCircle, Mail, User, Sparkles, Watch, Phone } from 'lucide-react';
import { axiosInstance } from '../baseurl/axiosInstance';

// Particle System Component
const ParticleSystem = ({ density = 30, speed = 0.3, color = 'rgba(255, 255, 255, 0.1)' }) => {
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

    particles.current = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 2 + 1,
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

// Floating Orbs Component
const FloatingOrbs = () => {
  const orbs = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    size: Math.random() * 150 + 60,
    delay: Math.random() * 12,
    duration: Math.random() * 20 + 25,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {orbs.map(orb => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full bg-gradient-to-br from-white/10 to-purple-500/20 backdrop-blur-sm"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, 40, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.7, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// OTP Input Component
const OTPInput = ({ length = 6, onComplete, value, onChange }) => {
  const inputRefs = useRef([]);

  const handleInputChange = (index, inputValue) => {
    const newValue = value.split('');
    newValue[index] = inputValue;
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedValue.length === length) {
      onComplete(updatedValue);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').slice(0, length);
    onChange(pastedText);
    
    if (pastedText.length === length) {
      onComplete(pastedText);
    }
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {Array.from({ length }, (_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, type: "spring" }}
        >
          <Input
            ref={el => inputRefs.current[index] = el}
            type="text"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-bold border-2 border-purple-200 focus:border-purple-500 rounded-lg bg-white/80 backdrop-blur-sm"
          />
        </motion.div>
      ))}
    </div>
  );
};

// Timer Component
const Timer = ({ initialTime, onComplete, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) return;

    setTimeLeft(initialTime);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime, onComplete, isActive]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <motion.div 
      className="flex items-center justify-center gap-2 text-gray-600"
      animate={{ 
        color: timeLeft <= 30 ? "#ef4444" : "#6b7280",
        scale: timeLeft <= 10 ? [1, 1.1, 1] : 1
      }}
      transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
    >
      <Watch className="h-4 w-4" />
      <span className="font-mono text-lg">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </motion.div>
  );
};

// Main Signup Component
export default function SignupPage() {
  const [step, setStep] = useState('signup'); // 'signup' or 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field, value) => {
    // For phone field, only allow digits and limit to 10 characters
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const handleSendOTP = async () => {
    setErrors({});
    setApiError('');
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
   
      const res = await axiosInstance.post("/send-otp",{phone: `91${formData.phone}`})
       if(res?.data.status==-9){
        setApiError( 'User already exists!');
       }
      else if(res.status==200) {
        setStep('otp');
        setIsTimerActive(true);
        setCanResend(false);
        setSuccessMessage(`OTP sent to +91 ${formData.phone}`);
      }
       else {
        setApiError( 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue) => {
    if (otpValue.length !== 6) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
     

      const response = await axiosInstance.post('/verify-otp',{ name: formData.name,
          email: formData.email,
          phone: `91${formData.phone}`,
          otp: otpValue})

      const data =  response.data.data;
      
      if (data.rows.length>0) {
        // Navigate to dashboard
        window.location.href = '/login';
        // Or if using React Router: navigate('/dashboard');
      } else {
        setApiError('OTP not verified. Please check the code and try again.');
        setOtp(''); // Clear the OTP input
      }
    } catch (error) {
      setApiError('Network error. Please check your connection and try again.');
      setOtp(''); // Clear the OTP input
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimerComplete = () => {
    setIsTimerActive(false);
    setCanResend(true);
  };

  const handleResendOTP = async () => {
    setOtp('');
    setApiError('');
    
    try {
      const res = await axiosInstance.post("/send-otp",{phone: `91${formData.phone}`})

      
      if (res.status==200) {
        setStep('otp');
        setIsTimerActive(true);
        setCanResend(false);
        setSuccessMessage(`OTP sent to +91 ${formData.phone}`);
      } else {
        setApiError( 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setApiError('Network error. Please check your connection and try again.');
    }
  };

  const handleBackToSignup = () => {
    setStep('signup');
    setOtp('');
    setIsTimerActive(false);
    setCanResend(false);
    setErrors({});
    setSuccessMessage('');
    setApiError('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/40 to-black/80 z-10" />
      
      {/* Particle Effects */}
      <ParticleSystem density={40} color="rgba(147, 51, 234, 0.15)" />
      <FloatingOrbs />
      
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-8 left-8 z-30"
      >
        <img 
          src='https://navbharatniwas.in/assets/blcklogo-CGNpodye.png' 
          alt="Navbharat Niwas Logo" 
          className='h-16 w-auto brightness-0 invert'
        />
      </motion.div>

      {/* Login Link */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-8 right-8 z-30"
      >
        <motion.a
          href="/login"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-white/80 hover:text-white transition-colors"
        >
          Already have an account? <span className="font-semibold text-purple-300">Login</span>
        </motion.a>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-md mx-auto px-6">
        <AnimatePresence mode="wait">
          {step === 'signup' ? (
            <motion.div
              key="signup-step"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center relative"
                  >
                    <UserPlus className="h-8 w-8 text-white" />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-30"
                    />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Join Navbharat Niwas
                  </CardTitle>
                  <p className="text-gray-300">
                    Create your account to find your dream home
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {apiError}
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-400" />
                        Full Name
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 ${
                            errors.name ? 'border-red-400' : ''
                          }`}
                        />
                      </motion.div>
                      {errors.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-400 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.name}
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-purple-400" />
                        Email Address
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 ${
                            errors.email ? 'border-red-400' : ''
                          }`}
                        />
                      </motion.div>
                      {errors.email && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-400 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.email}
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-purple-400" />
                        Mobile Number
                      </label>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-sm">+91</span>
                        </div>
                        <Input
                          type="tel"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`h-12 pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 ${
                            errors.phone ? 'border-red-400' : ''
                          }`}
                        />
                      </motion.div>
                      {errors.phone && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-red-400 text-sm"
                        >
                          <AlertCircle className="h-4 w-4" />
                          {errors.phone}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg border-0 relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ 
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{ 
                          backgroundSize: "200% 100%"
                        }}
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            Send OTP
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>

                  <div className="text-center space-y-2">
                    <p className="text-gray-400 text-sm">
                      By creating an account, you agree to our
                    </p>
                    <div className="flex justify-center space-x-4 text-sm">
                      <motion.a 
                        href="#" 
                        whileHover={{ scale: 1.05 }}
                        className="text-purple-300 hover:text-purple-200 underline"
                      >
                        Terms of Service
                      </motion.a>
                      <span className="text-gray-500">•</span>
                      <motion.a 
                        href="#" 
                        whileHover={{ scale: 1.05 }}
                        className="text-purple-300 hover:text-purple-200 underline"
                      >
                        Privacy Policy
                      </motion.a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center relative"
                  >
                    <Shield className="h-8 w-8 text-white" />
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-emerald-300 opacity-30"
                    />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Verify Your Phone
                  </CardTitle>
                  <div className="text-gray-300 space-y-1">
                    <p>Hi <span className="font-semibold text-white">{formData.name}</span>!</p>
                    <p>We've sent a 6-digit code to</p>
                    <p className="font-semibold text-purple-300">+91 {formData.phone}</p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {successMessage}
                    </motion.div>
                  )}

                  {apiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {apiError}
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-200 block text-center">
                      Enter 6-digit verification code
                    </label>
                    <OTPInput
                      length={6}
                      value={otp}
                      onChange={setOtp}
                      onComplete={handleVerifyOTP}
                    />
                  </div>

                  <div className="text-center space-y-4">
                    <Timer
                      initialTime={120} // 2 minutes
                      onComplete={handleTimerComplete}
                      isActive={isTimerActive}
                    />
                    
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">
                        Didn't receive the code?
                      </p>
                      <motion.button
                        onClick={handleResendOTP}
                        disabled={!canResend}
                        whileHover={{ scale: canResend ? 1.05 : 1 }}
                        whileTap={{ scale: canResend ? 0.95 : 1 }}
                        className={`text-sm font-semibold ${
                          canResend 
                            ? 'text-purple-400 hover:text-purple-300' 
                            : 'text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Resend OTP
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleBackToSignup}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to signup
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-black/40 to-transparent z-10" />
      
      {/* Floating Icons */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-20 left-20 text-white/20 z-10"
      >
        <Sparkles size={40} />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, -15, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute top-1/3 right-20 text-purple-300/20 z-10"
      >
        <UserPlus size={50} />
      </motion.div>
    </div>
  );
}