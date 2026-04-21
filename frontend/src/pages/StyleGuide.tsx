import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Divider from '../components/Divider';

export default function StyleGuide() {
  return (
    <div className='main-content container container--md'>
      <div className='stack'>
        <section className='stack'>
          <h1>Component Showcase</h1>
          <p className='text-muted'>
            All available components in Stefan Astro Starter
          </p>
        </section>

        <Divider />

        <section className='stack'>
          <h2>Typography</h2>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <p>
            This is a paragraph with <strong>bold text</strong> and{' '}
            <em>italic text</em>.
          </p>
          <p className='text-muted'>This is muted text.</p>
        </section>

        <Divider />

        <section className='stack'>
          <h2>Buttons</h2>
          <div className='flex gap-3 flex-wrap'>
            <Button variant='default'>Default Button</Button>
            <Button variant='primary'>Primary Button</Button>
            <Button variant='ghost'>Ghost Button</Button>
            <Button variant='outline'>Outline Button</Button>
          </div>
        </section>

        <Divider />

        <section className='stack'>
          <h2>Badges</h2>
          <div className='flex gap-3 flex-wrap'>
            <Badge variant='default'>Default</Badge>
            <Badge variant='success'>Success</Badge>
            <Badge variant='warning'>Warning</Badge>
            <Badge variant='error'>Error</Badge>
            <Badge variant='info'>Info</Badge>
          </div>
        </section>

        <Divider />

        <section className='stack'>
          <h2>Cards</h2>
          <div className='grid grid--cols-3'>
            <Card variant='default'>
              <h3>Default Card</h3>
              <p>This is a default card with medium padding.</p>
            </Card>

            <Card variant='elevated'>
              <h3>Elevated Card</h3>
              <p>This card has an elevated appearance with shadow.</p>
            </Card>

            <Card variant='bordered'>
              <h3>Bordered Card</h3>
              <p>This card has a prominent border.</p>
            </Card>
          </div>
        </section>

        <Divider />

        <section className='stack'>
          <h2>Layout Utilities</h2>

          <h3>Stack (Vertical Spacing)</h3>
          <div className='stack'>
            <Card>
              <p>Item 1</p>
            </Card>
            <Card>
              <p>Item 2</p>
            </Card>
            <Card>
              <p>Item 3</p>
            </Card>
          </div>

          <Divider />

          <h3>Grid (Responsive)</h3>
          <div className='grid grid--responsive'>
            <Card>
              <p>Grid Item 1</p>
            </Card>
            <Card>
              <p>Grid Item 2</p>
            </Card>
            <Card>
              <p>Grid Item 3</p>
            </Card>
            <Card>
              <p>Grid Item 4</p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
