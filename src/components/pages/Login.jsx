import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, ArrowLeft, Shield, CheckCircle2, AlertCircle, Watch } from 'lucide-react';
import { axiosInstance } from '../baseurl/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';


const customFontStyle = {
  fontFamily: "'SF Pro Text', serif", // Changed to serif for better font matching
  fontWeight: 400, // Katibeh is typically regular weight
  fontStyle: "normal",
};


// OTP Input Component (Restyled for Light Theme)
const OTPInput = ({ length = 6, onComplete, value, onChange }) => {
  const inputRefs = useRef([]);

  const handleInputChange = (index, inputValue) => {
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    if (numericValue.length > 1) return;

    const newValue = value.split('');
    newValue[index] = numericValue;
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    if (numericValue && index < length - 1) {
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
    const pastedText = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    onChange(pastedText);
    
    if (pastedText.length === length) {
      onComplete(pastedText);
    }
  };

  return (
    <div  className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length }, (_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, type: "spring" }}
        >
          <Input
            ref={el => inputRefs.current[index] = el}
            type="tel"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-slate-100 text-slate-900"
          />
        </motion.div>
      ))}
    </div>
  );
};

// Timer Component (Restyled for Light Theme)
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
      className="flex items-center justify-center gap-2 text-slate-500"
      animate={{ 
        color: timeLeft <= 30 ? "#ef4444" : "#64748b", // slate-500
        scale: timeLeft <= 10 ? [1, 1.05, 1] : 1
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
  const navigate = useNavigate();

  // --- All your existing logic functions (no changes needed) ---
  const validateMobileNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.length === 10 && /^[6-9]\d{9}$/.test(cleanNumber);
  };

  const formatMobileNumber = (number) => {
    const cleanNumber = number.replace(/\D/g, '');
    return cleanNumber.slice(0, 10);
  };

  const getFullMobileNumber = () => `91${mobileNumber}`;

  const handleSendOTP = async () => {
    setErrors({});
    if (!validateMobileNumber(mobileNumber)) {
      setErrors({ mobile: 'Please enter a valid 10-digit mobile number' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/login/send-otp', { phone: getFullMobileNumber() });
      if (res.data.status == 1) {
        setStep('otp');
        setIsTimerActive(true);
        setCanResend(false);
        setSuccessMessage(`OTP sent successfully!`);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrors({ mobile: 'User not Found, please register first!' });
      }
    } catch (error) {
      setErrors({ mobile: 'Network error. Please try again.' });
      console.error('Send OTP Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otpValue) => {
    if (otpValue.length !== 6) return;
    setIsLoading(true);
    setErrors({});
    try {
      const res = await axiosInstance.post("/login/verify-otp", { phone: getFullMobileNumber(), otp: otpValue });
      if (res?.data?.status == 1) {
        localStorage.setItem("userdata", JSON.stringify(res?.data?.data?.rows[0]));
        localStorage.setItem("isAuthenticated", true);
        if (res?.data?.data?.rows[0].role == 0) {
          navigate('/dashboard-user');
        } else {
          navigate('/dashboard-admin');
        }
      } else {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
        setOtp('');
      }
    } catch (error) {
      setErrors({ otp: 'Network error. Please try again.' });
      console.error('Verify OTP Error:', error);
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    setOtp('');
    setErrors({});
    setIsLoading(true);
    try {
      // Re-using the send OTP logic for resend
      const res = await axiosInstance.post('/login/send-otp', { phone: getFullMobileNumber() });
      if (res.data.status == 1) {
        setIsTimerActive(true);
        setCanResend(false);
        setSuccessMessage('A new OTP has been sent.');
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrors({ otp: 'Failed to resend OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ otp: 'Network error while resending. Please try again.' });
      console.error('Resend OTP Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimerComplete = () => {
    setIsTimerActive(false);
    setCanResend(true);
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

  const StepWrapper = ({ children, key }) => (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );

  return (
    <div style={customFontStyle} className="min-h-screen w-full bg-white lg:grid lg:grid-cols-2">
      {/* --- Left Panel: Form --- */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-10">
            <img 
              src='https://navbharatniwas.in/assets/blcklogo-CGNpodye.png' 
              alt="Navbharat Niwas Logo" 
              className='h-12 w-auto' // Removed invert class
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 'mobile' ? (
              <StepWrapper key="mobile">
                <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
                <p className="text-slate-600 mt-2">
                  Enter your mobile number to receive a verification code.
                </p>

                <div className="space-y-6 mt-8">
                  <div className="space-y-2">
                    <label htmlFor="mobile" className="text-sm font-medium text-slate-700">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium pointer-events-none">
                        +91
                      </div>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="98765 43210"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        className={`h-12 text-base pl-12 bg-slate-100 border-slate-200 focus:bg-white text-slate-900 placeholder:text-slate-400 ${
                          errors.mobile ? 'border-red-500' : ''
                        }`}
                        maxLength={10}
                      />
                    </div>
                    {errors.mobile && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.mobile}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : 'Send OTP'}
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-slate-600">
                    Not registered? <Link className='font-medium text-slate-900 underline hover:text-slate-700' to={'/register'}>Create an account</Link>
                  </p>
                </div>
              </StepWrapper>
            ) : (
              <StepWrapper key="otp">
                <h1 className="text-3xl font-bold text-slate-900">Verify Your Mobile</h1>
                <p className="text-slate-600 mt-2">
                  We've sent a 6-digit code to <br />
                  <span className="font-semibold text-slate-800">{getFullMobileNumber()}</span>
                </p>
                
                <div className="space-y-6 mt-8">
                  {successMessage && (
                     <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      <CheckCircle2 className="h-4 w-4" />
                      {successMessage}
                    </div>
                  )}
                  {errors.otp && (
                    <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      <AlertCircle className="h-4 w-4" />
                      {errors.otp}
                    </div>
                  )}
                  <OTPInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleVerifyOTP}
                  />
                  <div className="text-center space-y-3">
                    <Timer
                      initialTime={120}
                      onComplete={handleTimerComplete}
                      isActive={isTimerActive}
                    />
                    <button
                      onClick={handleResendOTP}
                      disabled={!canResend || isLoading}
                      className="text-sm font-medium text-slate-900 hover:text-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleBackToMobile}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mx-auto mt-8 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to mobile number
                </button>
              </StepWrapper>
            )}
          </AnimatePresence>

          <p className="text-xs text-slate-400 text-center mt-12">
            © {new Date().getFullYear()} Navbharat Niwas. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* --- Right Panel: Image --- */}
      <div className="hidden lg:flex items-center justify-center relative bg-slate-100 p-12">
        <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop')" }}
        >
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>

        <motion.div 
            className="relative bg-white/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-800">
            Secure & Seamless Access
          </h2>
          <p className="mt-2 text-slate-600 max-w-sm">
            Your digital gateway to Navbharat Niwas. Log in quickly and securely with OTP verification.
          </p>
        </motion.div>
      </div>
    </div>
  );
}