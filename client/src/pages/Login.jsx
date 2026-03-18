import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Phone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup recaptcha on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("Recaptcha solved");
        }
      });
    }
  };

  const onSignInSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+254${phoneNumber.replace(/^0+/, '')}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setVerificationId(confirmationResult);
      setLoading(false);
    } catch (err) {
      console.error("SMS Error:", err);
      setError("Failed to send code. Please check your number and try again.");
      setLoading(false);
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    }
  };

  const onCodeVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await verificationId.confirm(verificationCode);
      navigate('/');
    } catch (err) {
      console.error("Verify Error:", err);
      setError("Invalid code. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone className="text-primary-600 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">
          {verificationId ? 'Enter Code' : 'Welcome Back'}
        </h1>
        <p className="text-gray-500 text-sm">
          {verificationId 
            ? `We sent a code to your phone number.` 
            : 'Login with your phone number to track orders and more.'}
        </p>
      </div>

      <div className="w-full max-w-sm">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!verificationId ? (
          <form onSubmit={onSignInSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+254</span>
              <input
                type="tel"
                placeholder="700 000 000"
                className="w-full bg-white border border-orange-100 rounded-2xl py-4 pl-16 pr-4 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm text-lg"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className="w-full btn-primary py-4 flex items-center justify-center space-x-2 text-lg font-bold"
            >
              <span>{loading ? 'Sending...' : 'Send Code'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div id="recaptcha-container"></div>
          </form>
        ) : (
          <form onSubmit={onCodeVerify} className="space-y-4">
            <input
              type="text"
              placeholder="000 000"
              maxLength="6"
              className="w-full bg-white border border-orange-100 rounded-2xl py-4 px-4 text-center tracking-[1em] font-black text-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading || verificationCode.length < 6}
              className="w-full btn-primary py-4 flex items-center justify-center space-x-2 text-lg font-bold"
            >
              <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
              <ShieldCheck className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setVerificationId(null)}
              className="w-full text-gray-400 text-sm font-medium hover:text-primary-600 py-2"
            >
              Change phone number
            </button>
          </form>
        )}
      </div>

      <div className="text-center text-xs text-gray-400">
        By continuing, you agree to our <br />
        <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
      </div>
    </div>
  );
};

export default Login;
