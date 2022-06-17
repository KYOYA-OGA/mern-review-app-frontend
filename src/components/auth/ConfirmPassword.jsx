import React, { useEffect, useState } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword, verifyPasswordResetToken } from '../../api/auth';
import { useNotification } from '../../hooks';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';

export default function ConfirmPassword() {
  const [password, setPassword] = useState({
    one: '',
    two: '',
  });

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);
    setIsVerifying(false);
    if (error) {
      navigate('/auth/reset-password', { replace: true });
      return updateNotification('error', error);
    }

    if (!valid) {
      setIsValid(false);
      return navigate('/auth/reset-password', { replace: true });
    }

    setIsValid(true);
  };

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.one.trim()) {
      return updateNotification('error', 'Password is missing');
    }

    if (password.one.trim().length < 8) {
      return updateNotification(
        'error',
        'Password must be at least 8 characters'
      );
    }

    if (password.one !== password.two) {
      return updateNotification('error', 'Passwords do not match');
    }

    const { error, message } = await resetPassword({
      newPassword: password.one,
      userId: id,
      token,
    });
    if (error) return updateNotification('error', error);

    updateNotification('success', message);
    navigate('/auth/signin', { replace: true });
  };

  useEffect(() => {
    isValidToken();
  }, []);

  if (isVerifying)
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center text-4xl dark:text-white text-primary">
            <h1 className="font-semibold">
              Please wait... we are verifying your token!
            </h1>
            <ImSpinner3 className="animate-spin" />
          </div>
        </Container>
      </FormContainer>
    );

  if (!isValid)
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center text-4xl dark:text-white text-primary">
            <h1 className="font-semibold">Sorry the token is invalid!</h1>
          </div>
        </Container>
      </FormContainer>
    );

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={`w-96 ${commonModalClasses}`}>
          <Title>Enter New Password</Title>
          <FormInput
            label="New Password"
            name="one"
            placeholder="********"
            type="password"
            value={password.one}
            onChange={handleChange}
          />
          <FormInput
            label="Confirm Password"
            name="two"
            placeholder="********"
            type="password"
            value={password.two}
            onChange={handleChange}
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}
