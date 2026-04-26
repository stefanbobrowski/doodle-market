import viteLogo from '../assets/vite.svg';
import reactLogo from '../assets/react.svg';
import expressLogo from '../assets/express.png';
import typeScriptLogo from '../assets/typescript.jpeg';

const About = () => {
  return (
    <div>
      <h1>About Doodle Market</h1>
      <p>
        Doodle Market is a platform where you can buy and sell unique doodles
        created by talented artists.
      </p>
      <p>
        Made by{' '}
        <a
          href='https://www.stefanbobrowski.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          Stefan Bobrowski
        </a>{' '}
        with Vite, React, TypeScript, and Express.js
      </p>
      <p className='logo-row'>
        <div>
          <img src={viteLogo} alt='Vite Logo' />
        </div>
        <div>
          <img src={reactLogo} alt='React Logo' />
        </div>
        <div>
          <img src={typeScriptLogo} alt='TypeScript Logo' />
        </div>
        <div>
          <img src={expressLogo} alt='Express Logo' />
        </div>
      </p>
    </div>
  );
};

export default About;
