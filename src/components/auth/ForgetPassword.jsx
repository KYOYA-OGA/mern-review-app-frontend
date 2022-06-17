import React, { useState } from 'react';
import { forgetPassword } from '../../api/auth';
import { useNotification } from '../../hooks';
import { isValidEmail } from '../../utils/helper';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import CustomLink from '../CustomLink';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email))
      return updateNotification('error', 'Email is invalid');

    const { error, message } = await forgetPassword(email);

    if (error) return updateNotification('error', message);

    updateNotification('success', message);
  };
  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={`w-96 ${commonModalClasses}`}>
          <Title>Please Enter Your Email</Title>
          <FormInput
            onChange={handleChange}
            value={email}
            label="Email"
            name="email"
            placeholder="john@email.com"
          />
          <Submit value="Send Link" />

          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign in</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
