# Reviews Mini App

A Next.js-based mini app for World App, allowing users to search for businesses, view and leave reviews, and interact with a full-screen map. Only real humans with a verified World ID can leave comments, ensuring sybil resistance and authenticity. **This project was developed from scratch for ETHGlobal Prague, and is designed to go against mass botted reviews by requiring World ID verification for every comment.**

**This project was developed from scratch for ETHGlobal Prague.**

---

## Features

- **Full-Screen Map:** Interactive map with business search and review statistics.
- **World ID Integration:** Only verified World ID users can leave reviews/comments.
- **Review System:** Users can submit and view reviews for businesses.
- **Modern UI:** Built with Mini Apps UI Kit and Tailwind CSS for a native-like experience.
- **Secure Backend:** All review submissions are verified server-side for World ID proof.
- **Sybil Resistance:** Each user can only leave one review per business.

---

## Project Structure

```
my-first-mini-app/
├── prisma/                # Database schema and migrations
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/           # API routes (reviews, search, verify-proof, etc.)
│   │   ├── business/      # Business detail pages
│   │   └── (protected)/   # Authenticated app pages (home, layout)
│   ├── components/        # UI components (BusinessMap, ReviewForm, Verify, etc.)
│   ├── lib/               # Prisma client and utilities
│   └── ...                # Other app code
├── public/                # Static assets (icons, images, etc.)
├── package.json
├── README.md
└── ...
```

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd my-first-mini-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in the required values (database, World ID app ID, etc).

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **(Optional) Expose your app for World App testing:**
   ```bash
   ngrok http 3000
   ```

---

## World ID Integration

- **Frontend:**  
  - Users must verify with World ID before they can leave a review.
  - The verification flow uses MiniKit and only allows access to the review form after successful proof.
  - The World ID proof is sent with every review submission.

- **Backend:**  
  - The `/api/reviews` endpoint requires a valid World ID proof for every review.
  - Proofs are verified server-side using the Worldcoin Developer Portal API.
  - Only reviews with valid, unused proofs are accepted.

- **Sybil Resistance:**  
  - Each user can only leave one review per business.
  - (Optionally) The nullifier hash from the proof can be stored for further audit or cross-action sybil resistance.

---

## Main Components

- **BusinessMap:** Full-screen map with business search and review stats.
- **ReviewFormWrapper:** Handles World ID verification and review submission gating.
- **ReviewForm:** The form for submitting a review.
- **Verify:** Standalone World ID verification component (example).
- **PageLayout:** Consistent layout for all pages.

---

## Security

- All sensitive actions (leaving a review) are protected by World ID proof, verified on the backend.
- No review can be submitted without a valid, unused proof.
- The backend is the source of truth for all verification.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

---

## License

MIT
