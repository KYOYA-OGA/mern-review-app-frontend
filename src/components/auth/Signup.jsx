import React from 'react';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import CustomLink from '../CustomLink';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';

export default function Signup() {
  return (
    <FormContainer>
      <Container>
        <form className={`w-72 ${commonModalClasses}`}>
          <Title>Sign up</Title>
          <FormInput label="Name" name="name" placeholder="john Doe" />
          <FormInput label="Email" name="email" placeholder="john@email.com" />
          <FormInput label="Password" name="password" placeholder="********" />
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
