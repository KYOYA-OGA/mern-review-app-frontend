import React, { useEffect, useRef, useState } from 'react';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import FormContainer from '../form/FormContainer';
import Submit from '../form/Submit';
import Title from '../form/Title';
import { useNavigate, useLocation } from 'react-router-dom';
import { resendEmailVerificationToken, verifyUserEmail } from '../../api/auth';
import { useAuth, useNotification } from '../../hooks';

const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    valid = !isNaN(parseInt(val));
    if (!valid) break;
  }
  return valid;
};

export default function EmailVerification() {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state && state.user;

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified = profile?.isVerified;

  const inputRef = useRef(null);

  const { updateNotification } = useNotification();

  const focusPreviousInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(nextIndex);
  };

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const handleOtpChange = ({ target }) => {
    const { value } = target;
    const newOtp = [...otp];
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);

    if (!value) focusPreviousInputField(currentOTPIndex);
    else focusNextInputField(currentOTPIndex);

    setOtp([...newOtp]);
  };

  const handleKeyDown = ({ key }, index) => {
    currentOTPIndex = index;
    if (key === 'Backspace') {
      focusPreviousInputField(currentOTPIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidOTP(otp)) {
      return updateNotification('error', 'Invalid OTP');
    }

    const {
      error,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(''),
      userId: user?.id,
    });
    if (error) return updateNotification('error', error);

    updateNotification('success', message);
    localStorage.setItem('auth-token', userResponse.token);
    isAuth();
  };

  const handleOTPResend = async () => {
    const { error, message } = await resendEmailVerificationToken(user.id);
    if (error) return updateNotification('error', error);

    updateNotification('success', message);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (!user) navigate('/not-found');
    if (isLoggedIn && isVerified) navigate('/');
    // eslint-disable-next-line
  }, [user, isLoggedIn, isVerified]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please Enter the OTP to verify your account</Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email
            </p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex === index ? inputRef : null}
                  type="number"
                  value={otp[index] || ''}
                  onChange={handleOtpChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  key={index}
                  className="w-12 h-12 border-2 dark:border-dark-subtle border-light-subtle rounded dark:focus:border-white focus:border-primary bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl spin-button-none"
                />
              );
            })}
          </div>
          <div>
            <Submit value="Verify Account" />
            <button
              type="button"
              onClick={handleOTPResend}
              className="dark:text-white text-blue-500 font-semibold hover:underline mt-3"
            >
              I don't have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
