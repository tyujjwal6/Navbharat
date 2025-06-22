

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowLeft, Shield, CheckCircle2, AlertCircle, Watch } from 'lucide-react';
import { axiosInstance } from '../baseurl/axiosInstance';
import { useNavigate } from 'react-router-dom';

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
  const orbs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 120 + 80,
    delay: Math.random() * 10,
    duration: Math.random() * 15 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {orbs.map(orb => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full bg-gradient-to-br from-white/10 to-indigo-500/20 backdrop-blur-sm"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
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
            className="w-12 h-12 text-center text-xl font-bold border-2 border-indigo-200 focus:border-indigo-500 rounded-lg bg-white/80 backdrop-blur-sm"
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

// Main Login Component
export default function LoginPage() {
  const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateMobileNumber = (number) => {
    // Remove all non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    // Check if it's exactly 10 digits (after +91)
    return cleanNumber.length === 10 && /^[6-9]\d{9}$/.test(cleanNumber);
  };

  const formatMobileNumber = (number) => {
    // Remove all non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    // Limit to 10 digits
    return cleanNumber.slice(0, 10);
  };

  const getFullMobileNumber = () => {
    return `91${mobileNumber}`;
  };

  const handleSendOTP = async () => {
    setErrors({});
    
    if (!mobileNumber) {
      setErrors({ mobile: 'Mobile number is required' });
      return;
    }
    
    if (!validateMobileNumber(mobileNumber)) {
      setErrors({ mobile: 'Please enter a valid 10-digit mobile number' });
      return;
    }

    setIsLoading(true);
    
    try {
      
     const res = await axiosInstance.post('/login/send-otp',{phone:getFullMobileNumber()});
console.log(res.data.status)

      if (res.data.status ==1) {
        setIsLoading(false);
        setStep('otp');
        setIsTimerActive(true);
        setCanResend(false);
        setSuccessMessage(`OTP sent to ${getFullMobileNumber()}`);
      } else {
        setIsLoading(false);
        setErrors({ 
          mobile:'Failed to send OTP. Please try again.' 
        });
      }
    } catch (error) {
      setIsLoading(false);
      setErrors({ 
        mobile: 'Network error. Please check your connection and try again.' 
      });
      console.error('Send OTP Error:', error);
    }
  };
  const navigate = useNavigate();

  const handleVerifyOTP = async (otpValue) => {
    if (otpValue.length !== 6) return;
    
    setIsLoading(true);
    
    try {
      const res = await axiosInstance.post("/login/verify-otp",{phone:getFullMobileNumber(),otp:otpValue})


      if (res?.data?.status==1) {
        setIsLoading(false);
       localStorage.setItem("userdata",JSON.stringify(res?.data?.data?.rows[0]));
       localStorage.setItem("isAuthenticated",true);
       if(res?.data?.data?.rows[0].role==0)
       {
         navigate('/dashboard-user');
       }
       else{
         navigate('/dashboard-admin');
       }
        
      } else {
        setIsLoading(false);
        setErrors({ 
          otp:  'Invalid OTP. Please try again.' 
        });
        // Clear OTP input on error
        setOtp('');
      }
    } catch (error) {
      setIsLoading(false);
      setErrors({ 
        otp: 'Network error. Please check your connection and try again.' 
      });
      console.error('Verify OTP Error:', error);
      // Clear OTP input on error
      setOtp('');
    }
  };

  const handleTimerComplete = () => {
    setIsTimerActive(false);
    setCanResend(true);
  };

  const handleResendOTP = async () => {
    setOtp('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: getFullMobileNumber(),
          resend: true, // Flag to indicate this is a resend request
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoading(false);
        setIsTimerActive(true);
        setCanResend(false);
        setSuccessMessage(data.message || 'OTP resent successfully');
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setIsLoading(false);
        setErrors({ 
          otp: data.message || 'Failed to resend OTP. Please try again.' 
        });
      }
    } catch (error) {
      setIsLoading(false);
      setErrors({ 
        otp: 'Network error. Please check your connection and try again.' 
      });
      console.error('Resend OTP Error:', error);
    }
  };

  const handleBackToMobile = () => {
    setStep('mobile');
    setOtp('');
    setIsTimerActive(false);
    setCanResend(false);
    setErrors({});
    setSuccessMessage('');
    setIsLoading(false);
  };

  const handleMobileChange = (e) => {
    const formatted = formatMobileNumber(e.target.value);
    setMobileNumber(formatted);
    if (errors.mobile) setErrors({});
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        src="https://videos.pexels.com/video-files/7646757/7646757-uhd_2560_1440_25fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-indigo-900/70 z-10" />
      
      {/* Particle Effects */}
      <ParticleSystem />
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

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-md mx-auto px-6">
        <AnimatePresence mode="wait">
          {step === 'mobile' ? (
            <motion.div
              key="mobile-step"
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
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <Phone className="h-8 w-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Welcome Back
                  </CardTitle>
                  <p className="text-gray-300">
                    Enter your mobile number to receive a verification code
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Mobile Number
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 font-medium">
                        +91
                      </div>
                      <Input
                        type="tel"
                        placeholder="9876543210"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        className={`h-12 pl-14 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-indigo-400 ${
                          errors.mobile ? 'border-red-400' : ''
                        }`}
                        maxLength={10}
                      />
                    </motion.div>
                    {errors.mobile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {errors.mobile}
                      </motion.div>
                    )}
                    <p className="text-xs text-gray-400">
                      Enter your 10-digit mobile number without country code
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg border-0"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  </motion.div>

                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
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
                    className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
                  >
                    <Shield className="h-8 w-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-white">
                    Verify Your Mobile
                  </CardTitle>
                  <p className="text-gray-300">
                    We've sent a 6-digit code to <br />
                    <span className="font-semibold text-white">{getFullMobileNumber()}</span>
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 p-3 rounded-lg border border-green-400/20"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {successMessage}
                    </motion.div>
                  )}

                  {errors.otp && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.otp}
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-200 block text-center">
                      Enter 6-digit code
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
                        disabled={!canResend || isLoading}
                        whileHover={{ scale: canResend && !isLoading ? 1.05 : 1 }}
                        whileTap={{ scale: canResend && !isLoading ? 0.95 : 1 }}
                        className={`text-sm font-semibold flex items-center gap-2 ${
                          canResend && !isLoading
                            ? 'text-indigo-400 hover:text-indigo-300' 
                            : 'text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isLoading && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          />
                        )}
                        Resend OTP
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleBackToMobile}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to mobile number
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent z-10" />
      <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-black/30 to-transparent z-10" />
    </div>
  );
}