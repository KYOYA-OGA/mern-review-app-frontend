import React from 'react';
import Container from '../Container';

export default function Signin() {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 w-72">
          <h1 className="text-xl text-white font-serif text-center">Sign in</h1>
          <div className="flex flex-col-reverse">
            <input
              type="text"
              id="email"
              className="bg-transparent rounded border-2 border-dark-subtle w-full text-lg outline-none focus:border-white p-1 text-white peer"
              placeholder="john@email.com"
            />
            <label
              htmlFor="email"
              className="font-semibold text-dark-subtle peer-focus:text-white transition-colors self-start"
            >
              Email
            </label>
          </div>
        </form>
      </Container>
    </div>
  );
}
