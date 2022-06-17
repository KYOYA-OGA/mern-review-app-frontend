import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/auth';
import { useAuth, useNotification } from '../../hooks';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import CustomLink from '../CustomLink';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';

const validateUserInfo = ({ name, email, password }) => {
  // eslint-disable-next-line
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) return { ok: false, error: 'Name is missing' };
  if (!isValidName.test(name)) return { ok: false, error: 'Invalid name' };

  if (!email.trim()) return { ok: false, error: 'Email is missing' };
  if (!isValidEmail.test(email))
    return { ok: false, error: 'Email is invalid' };

  if (!password.trim()) return { ok: false, error: 'Password is missing' };
  if (password.length < 8)
    return { ok: false, error: 'Password must be at least 8 characters' };

  return { ok: true };
};

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const { updateNotification } = useNotification();

  const { name, email, password } = userInfo;

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification('error', error);

    const response = await createUser(userInfo);
    if (response.error) return console.log(response.error);

    navigate('/auth/verification', {
      state: { user: response.user },
      replace: true,
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={`w-72 ${commonModalClasses}`}>
          <Title>Sign up</Title>
          <FormInput
            label="Name"
            name="name"
            placeholder="John Doe"
            onChange={handleChange}
            value={name}
          />
          <FormInput
            label="Email"
            name="email"
            placeholder="john@email.com"
            onChange={handleChange}
            value={email}
          />
          <FormInput
            label="Password"
            name="password"
            placeholder="********"
            onChange={handleChange}
            value={password}
            type="password"
          />
          <Submit value="Sign up" />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forgot Password?</CustomLink>
            <CustomLink to="/auth/signin">Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
