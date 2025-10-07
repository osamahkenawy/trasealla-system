'use client';

import DarkLogo from '@/assets/images/TRASEALLA.png';
import LightLogo from '@/assets/images/logo-light.png';
import { useAuthContext } from '@/context/useAuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, Button, Carousel, Form } from 'react-bootstrap';

const SignIn = () => {
  const router = useRouter();
  const { login, isAuthenticated, getRedirectPath } = useAuthContext();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getRedirectPath();
      router.replace(redirectPath);
    }
  }, [isAuthenticated, router, getRedirectPath]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlertMessage(null);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        setAlertMessage({
          type: 'success',
          message: 'Login successful! Redirecting...'
        });

        // Redirect based on role
        setTimeout(() => {
          const redirectPath = getRedirectPath();
          router.push(redirectPath);
        }, 1500);
      } else {
        setAlertMessage({
          type: 'danger',
          message: result.message || 'Login failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      setAlertMessage({
        type: 'danger',
        message: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/reset-password');
  };

  const handleRegister = () => {
    router.push('/auth/sign-up');
  };

  const carouselItems = [
    {
      src: '/assets/images/admin-background.png',
      subHeader: 'Your gateway to unforgettable adventures around the world'
    }
  ];

  return (
    <div className="login-container">
      {/* Left Sidebar with Carousel */}
      <div className="carousel-sidebar">
        <Carousel 
          indicators={true} 
          controls={false} 
          interval={5000}
          fade
          className="h-100 auth-carousel"
        >
          {carouselItems.map((item, index) => (
            <Carousel.Item key={index}>
              <div
                className="carousel-image-wrapped"
                style={{ backgroundImage: `url(${item.src})` }}
              >
                <div className="content-overlay">
                  {item.subHeader && (
                    <div className="carousel-subheader">
                      <p>{item.subHeader}</p>
                    </div>
                  )}
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Right Panel with Login Form */}
      <div className="login-panel">
        <div className="login-content">
          <div className="main-content-wrapper">
            <div className="form-container">
              {/* Logo */}
              <div className="logo-container">
                <div className="mx-auto text-center auth-logo">
                  <Link href="/dashboards" className="logo-dark">
                    <Image src={DarkLogo} height={52} alt="Trasealla Logo" />
                  </Link>
                  <Link href="/dashboards" className="logo-light">
                    <Image src={LightLogo} height={28} alt="Trasealla Logo" />
                  </Link>
                </div>
              </div>

              {/* Alert Message */}
              {alertMessage && (
                <Alert 
                  variant={alertMessage.type} 
                  dismissible 
                  onClose={() => setAlertMessage(null)}
                  className="mb-3"
                >
                  {alertMessage.message}
                </Alert>
              )}

              {/* Login Form */}
              <Form onSubmit={handleSubmit} className="login-form">
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="field-label">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    isInvalid={!!errors.email}
                    disabled={loading}
                    className="form-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label className="field-label">
                    Password
                  </Form.Label>
                  <div className="password-input-wrapper">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      isInvalid={!!errors.password}
                      disabled={loading}
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Check 
                    type="checkbox" 
                    label="Remember me"
                    className="remember-me-check"
                  />
                  <Button 
                    variant="link" 
                    className="forgot-password-link"
                    onClick={handleForgotPassword}
                    disabled={loading}
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 login-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center mt-3">
                  <span className="no-account-text">
                    Don&apos;t have an account?{' '}
                  </span>
                  <Button 
                    variant="link" 
                    className="register-link"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    Register Now
                  </Button>
                </div>
              </Form>
            </div>
          </div>

          {/* Footer with Logo */}
          <div className="login-footer">
            <div className="mx-auto text-center auth-logo mb-2" style={{ width: '40px' }}>
              <Link href="/dashboards" className="logo-dark">
                <Image src={DarkLogo} height={32} alt="logo" className="footer-logo" />
              </Link>
              <Link href="/dashboards" className="logo-light">
                <Image src={LightLogo} height={28} alt="logo" className="footer-logo" />
              </Link>
            </div>
            <span className="powered-by-text">
              © {new Date().getFullYear()} Trasealla. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;