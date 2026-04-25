import Button from '../components/Button';
import Divider from '../components/Divider';

export default function StyleGuide() {
  return (
    <div>
      <div>
        <section>
          <h1>Style Guide</h1>
        </section>

        <Divider />

        <section>
          <h2>Typography</h2>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <p>
            This is a paragraph with <strong>bold text</strong> and{' '}
            <em>italic text</em>.
          </p>
          <p className='muted'>This is muted text.</p>
          <p>
            This is a paragraph with a <a href='#'>link</a> and some{' '}
            <code>inline code</code>.
          </p>
          <p className='error'>Some error text.</p>
          <pre>
            <code className='error'>Some error text in the a code block</code>
          </pre>
          <pre>
            <code>
              {`function example() {
  console.log('This is a code block');
}`}
            </code>
          </pre>
        </section>

        <Divider />

        <section>
          <h2>Buttons</h2>
          <div className='flex'>
            <Button variant='default'>Default Button</Button>
            <Button variant='special'>Special Button</Button>
          </div>
        </section>

        <Divider />
      </div>
    </div>
  );
}
