import React from 'react';
import { commonModalClasses } from '../../utils/theme';
import Container from '../Container';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Submit from '../form/Submit';
import Title from '../form/Title';

export default function ConfirmPassword() {
  return (
    <FormContainer>
      <Container>
        <form className={`w-96 ${commonModalClasses}`}>
          <Title>Enter New Password</Title>
          <FormInput
            label="New Password"
            name="password"
            placeholder="********"
            type="password"
          />
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="********"
            type="password"
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
}
