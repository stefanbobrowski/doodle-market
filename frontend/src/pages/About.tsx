import viteLogo from '../assets/vite.svg';
import reactLogo from '../assets/react.svg';
import expressLogo from '../assets/express.png';
import typeScriptLogo from '../assets/typescript.jpeg';

const About = () => {
  return (
    <div className='about-page'>
      <h1>Doodle Market</h1>

      <pre className='ascii-art'>{`         '::.
    _________H ,%%&%,
   /\\     _   \\%&&%%&%
  /  \\___/^\\___\\%&%%&&
  |  | []   [] |%\\Y&%'
  |  |   .-.   | ||
~~@._|@@_|||_@@|~||~~~~~~~~~~~~~
      """) )"""`}</pre>

      <p>
        A full-stack Vite, React, TypeScript, Express app for uploading,
        selling, and rating doodles. Demonstrates backend concepts like JWT
        authentication, ownership-based authorization, purchase flow,
        transactional emails, audit logging, rate limiting, integration testing,
        and admin tooling.
      </p>
      <p>
        Made by{' '}
        <a
          href='https://www.stefanbobrowski.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          Stefan Bobrowski
        </a>
        .
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

      <h2>Features</h2>
      <ul>
        <li>
          <strong>Browse &amp; View</strong>: Gallery of doodles with view and
          like counters.
        </li>
        <li>
          <strong>Upload Doodles</strong>: Authenticated users can upload images
          with titles, descriptions, and prices. 5MB limit, images only,
          rate-limited to 5 uploads per hour.
        </li>
        <li>
          <strong>Edit &amp; Delete</strong>: Owners (and admins) can edit
          doodle details or replace the image, and delete with a two-step
          confirmation.
        </li>
        <li>
          <strong>Ownership Badges</strong>: Doodle cards show an owner badge
          for your own doodles. Edit/Delete controls are only shown to the owner
          or admin.
        </li>
        <li>
          <strong>Purchase Flow</strong>: Buy doodles using a demo account
          balance. Blocks self-purchase and enforces sufficient funds.
        </li>
        <li>
          <strong>Transactional Email</strong>: Purchase confirmation email sent
          via the Resend API with an itemized receipt.
        </li>
        <li>
          <strong>JWT Auth</strong>: Login returns a signed JWT (24h expiry)
          stored in localStorage and sent as a Bearer token on authenticated
          requests.
        </li>
        <li>
          <strong>Demo Accounts</strong>: Two preset user accounts (
          <code>pixel_pete</code>, <code>sketch_sam</code>) with quick-fill
          buttons on the login page. Admin account is intentionally not shown on
          the login UI.
        </li>
        <li>
          <strong>Admin Dashboard</strong>: Admin-only page to reset the entire
          app to seed state, wipe user-uploaded doodles, restore 5 seed doodles,
          and reset all account balances.
        </li>
        <li>
          <strong>Audit Log</strong>: Key events (uploads, purchases, edits,
          deletes, likes, views, resets) are appended to{' '}
          <code>logs/audit.json</code> with timestamps, usernames, and event
          data. A collapsible sidebar on every page displays the log with
          color-coded event types, refreshed automatically after each action.
        </li>
        <li>
          <strong>Rate Limiting</strong>: Upload endpoint is rate-limited per IP
          (5/hour) via <code>express-rate-limit</code>.
        </li>
        <li>
          <strong>Persistent Storage</strong>: Synchronous SQLite via{' '}
          <code>better-sqlite3</code>. DB auto-creates and seeds on first run.
        </li>
        <li>
          <strong>Endpoint Testing</strong>: Backend API tests with Vitest and
          Supertest, running against an in-memory SQLite database to keep tests
          isolated from real data.
        </li>
      </ul>

      <h2>Tech Stack</h2>
      <ul>
        <li>
          <strong>Frontend</strong>: Vite, React, TypeScript, SCSS
        </li>
        <li>
          <strong>Backend</strong>: Express.js, TypeScript, ESM (
          <code>tsx</code> in dev)
        </li>
        <li>
          <strong>Database</strong>: better-sqlite3 (SQLite)
        </li>
        <li>
          <strong>Auth</strong>: jsonwebtoken, bcryptjs
        </li>
        <li>
          <strong>Email</strong>: Resend API (<code>resend</code> SDK)
        </li>
        <li>
          <strong>File Uploads</strong>: multer
        </li>
        <li>
          <strong>Rate Limiting</strong>: express-rate-limit
        </li>
        <li>
          <strong>Testing</strong>: Vitest, Supertest
        </li>
      </ul>

      <h2>Demo Accounts</h2>
      <table className='about-table'>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Role</th>
            <th>Starting Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>pixel_pete</code>
            </td>
            <td>
              <code>pete123</code>
            </td>
            <td>user</td>
            <td>$100.00</td>
          </tr>
          <tr>
            <td>
              <code>sketch_sam</code>
            </td>
            <td>
              <code>sam123</code>
            </td>
            <td>user</td>
            <td>$100.00</td>
          </tr>
          <tr>
            <td>
              <code>admin</code>
            </td>
            <td>
              <em>(not shown on login page)</em>
            </td>
            <td>admin</td>
            <td>$1,000.00</td>
          </tr>
        </tbody>
      </table>

      <h2>API Endpoints</h2>

      <h3>Auth</h3>
      <ul>
        <li>
          <code>POST /auth/login</code> — Login, returns JWT + user object
        </li>
      </ul>

      <h3>Doodles</h3>
      <ul>
        <li>
          <code>GET /doodles</code> — Get all doodles
        </li>
        <li>
          <code>GET /doodles/:id</code> — Get a single doodle
        </li>
        <li>
          <code>POST /doodles</code> — Upload a new doodle{' '}
          <em>(auth required)</em>
        </li>
        <li>
          <code>PATCH /doodles/:id</code> — Update title, description, price, or
          image <em>(owner or admin)</em>
        </li>
        <li>
          <code>DELETE /doodles/:id</code> — Delete a doodle and its image file{' '}
          <em>(owner or admin)</em>
        </li>
        <li>
          <code>POST /doodles/:id/view</code> — Increment view count
        </li>
        <li>
          <code>POST /doodles/:id/like</code> — Increment like count
        </li>
        <li>
          <code>POST /doodles/:id/purchase</code> — Purchase a doodle, deducts
          balance, sends email receipt <em>(auth required)</em>
        </li>
      </ul>

      <h3>Admin</h3>
      <ul>
        <li>
          <code>POST /admin/reset</code> — Reset all doodles to seed + restore
          all balances <em>(admin only)</em>
        </li>
        <li>
          <code>POST /admin/reset-balance/:userId</code> — Reset a single user's
          balance <em>(admin only)</em>
        </li>
      </ul>

      <h3>Audit Log</h3>
      <ul>
        <li>
          <code>GET /audit-log</code> — Get the most recent 100 audit log
          entries (newest first)
        </li>
      </ul>
    </div>
  );
};

export default About;
