# Doodle Market

```
         '::.
    _________H ,%%&%,
   /\     _   \%&&%%&%
  /  \___/^\___\%&%%&&
  |  | []   [] |%\Y&%'
  |  |   .-.   | ||
~~@._|@@_|||_@@|~||~~~~~~~~~~~~~
      """) )"""
```

A full-stack Vite, React, TypeScript, Express app for uploading, selling, rating, and downloading doodles. Demonstrates backend concepts like orchestration, aggregation, business logic, media file handling, audit logging, and rate limiting.

## Features

- **Upload Doodles**: Users can upload images with titles, descriptions, and prices.
- **Browse & View**: Gallery of doodles with view/like counters.
- **Rate & Interact**: Like doodles and track engagement.
- **Audit Logging**: All actions (uploads, updates, likes) are logged for review.
- **Rate Limiting**: Prevents spam uploads with configurable limits.
- **Image Processing**: Automatic resizing and compression for consistent quality.
- **In-Memory Store**: Simple data persistence (resets on restart).

## Tech Stack

- **Frontend**: Vite, React, TypeScript
- **Backend**: Express.js, TypeScript

## API Endpoints

- `GET /doodles` - Get all doodles
- `GET /doodles/:id` - Get a single doodle
- `POST /doodles` - Upload a new doodle
- `PATCH /doodles/:id` - Update a doodle
- `DELETE /doodles/:id` - Delete a doodle
- `POST /doodles/:id/view` - Increment views
- `POST /doodles/:id/like` - Increment likes
