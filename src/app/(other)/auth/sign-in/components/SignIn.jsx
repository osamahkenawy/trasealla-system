'use client';

import DarkLogo from '@/assets/images/logo-dark.png';
import LightLogo from '@/assets/images/logo-light.png';
import TextFormInput from '@/components/from/TextFormInput';
import PasswordFormInput from '@/components/from/PasswordFormInput';
import { useAuthContext } from '@/context/useAuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const SignIn = () => {
  const router = useRouter();
  const { login, isAuthenticated, getRedirectPath } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const messageSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Please enter Email'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Please enter password')
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getRedirectPath();
      router.replace(redirectPath);
    }
  }, [isAuthenticated, router, getRedirectPath]);

  useEffect(() => {
    document.body.classList.add('authentication-bg');
    return () => {
      document.body.classList.remove('authentication-bg');
    };
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors: formErrors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(messageSchema)
  });

  const handleLogin = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        setSuccess(true);
        setError(null);

        // Show success message briefly then redirect
        setTimeout(() => {
          const redirectPath = getRedirectPath();
          router.push(redirectPath);
        }, 1000);
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
        setSuccess(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="account-pages py-5">
        <div className="container">
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="border-0 shadow-lg">
                <CardBody className="p-5">
                  <div className="text-center">
                    <div className="mx-auto mb-4 text-center auth-logo">
                      <a href="/" className="logo-dark">
                        <Image src={DarkLogo} height={32} alt="logo dark" />
                      </a>
                      <a href="/" className="logo-light">
                        <Image src={LightLogo} height={28} alt="logo light" />
                      </a>
                    </div>
                    <h4 className="fw-bold text-dark mb-2">Welcome Back!</h4>
                    <p className="text-muted">Sign in to your account to continue</p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)} className="mt-3">
                      {error}
                    </Alert>
                  )}

                  {/* Success Alert */}
                  {success && (
                    <Alert variant="success" className="mt-3">
                      Login successful! Redirecting...
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit(handleLogin)} className="mt-4">
                    <div className="mb-3">
                      <TextFormInput 
                        control={control} 
                        name="email" 
                        placeholder="Enter your email" 
                        className="form-control" 
                        label="Email Address"
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <Link href="/auth/reset-password" className="float-end text-muted ms-1">
                        Forgot password?{' '}
                      </Link>
                      <PasswordFormInput 
                        control={control} 
                        name="password" 
                        placeholder="Enter your password" 
                        className="form-control" 
                        label="Password"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-check mb-3">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="remember-me"
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="remember-me">
                        Remember me
                      </label>
                    </div>
                    <div className="d-grid">
                      <button 
                        className="btn btn-dark btn-lg fw-medium" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </button>
                    </div>
                  </form>
                </CardBody>
              </Card>
              <p className="text-center mt-4 text-white text-opacity-50">
                Don&apos;t have an account?{' '}
                <Link href="/auth/sign-up" className="text-decoration-none text-white fw-bold ms-1">
                  Sign Up
                </Link>
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default SignIn;