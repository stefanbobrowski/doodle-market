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
        with Vite, React, TypeScript, Express.js, and better-sqlite3.
      </p>
      <div className='logo-row'>
        <div>
          <img src={viteLogo} alt='Vite Logo' title='Vite' />
        </div>
        <div>
          <img src={reactLogo} alt='React Logo' title='React' />
        </div>
        <div>
          <img src={typeScriptLogo} alt='TypeScript Logo' title='TypeScript' />
        </div>
        <div>
          <img src={expressLogo} alt='Express Logo' title='Express.js' />
        </div>
      </div>
    </div>
  );
};

export default About;
