// Replace this shared placeholder with your business's general Google reviews URL.
const GOOGLE_REVIEWS_URL = '#';
// Reviewer photos matched by the supplied filenames; review text supplied by the owner.
const reviews = [
  {
    "photo": "/google-reviews/photos/renee-williams.png",
    "avatar": "",
    "initials": "RW",
    "name": "Renee Williams",
    "stars": 5,
    "date": "",
    "shortQuote": "One of the highlights of our trip.",
    "fullText": "This boat tour was, without question, one of the highlights of our trip. From the moment we stepped aboard, our captain and crew were absolutely incredible. They made the entire experience feel so personal, taking the time to make sure everyone was comfortable and creating an unforgettable day for our family.\n\nThe boat itself was beautiful, spotless, and impeccably maintained. Every stop along the route was even more breathtaking than the last—the crystal-clear water and stunning scenery felt almost unreal.. No matter which route you choose, you’re guaranteed an amazing experience.\n\nThis wasn’t just a boat tour; it was a memory we’ll cherish forever. I cannot recommend this experience highly enough. Thank you for making our day so special.\n\nGrazie, and God bless!"
  },
  {
    "photo": "/google-reviews/photos/katelyn-hill.png",
    "avatar": "",
    "initials": "KH",
    "name": "Katelyn Hill",
    "stars": 5,
    "date": "3 months ago",
    "shortQuote": "It was one of the best days of our trip!",
    "fullText": "Highly recommend this excursion! We spent my husband’s birthday on this tour with our 2 year old daughter and we loved every second of it. The crew was so accommodating and they did a great job of taking us to the most beautiful and uncrowded locations. The catamaran was amazing and so comfortable. We did our tour at the end of May and it wasn’t too busy. Our only regret was not wearing our shoes on the beach when the skipper suggested it, we live in Hawaii and thought we would be fine without shoes but we definitely wished we had them so we will definitely trust the skipper next time. Loved the tour, it was one of the best days of our trip!"
  },
  {
    "photo": "/google-reviews/photos/april-arnone.png",
    "avatar": "",
    "initials": "AA",
    "name": "April Arnone",
    "stars": 5,
    "date": "2 months ago",
    "shortQuote": "Great experience from start to finish!",
    "fullText": "My husband and I had such a wonderful, private, sailboat experience! Our Captain was friendly, personable, and knowledgeable. We were shown the best spots and had some very tasty foods. The trip was also catered to our requests. Highly recommend. Great experience from start to finish! Thanks again!"
  },
  {
    "photo": "/google-reviews/photos/lisa-zeno.png",
    "avatar": "",
    "initials": "LZ",
    "name": "Lisa Zeno",
    "stars": 5,
    "date": "2 months ago",
    "shortQuote": "I cannot recommend Claudio and Sardinia Discovery Travels enough!",
    "fullText": "I began working with Claudio 4 months before our trip. I found him through a Sardinian travel website and also saw his agency mentioned on TripAdvisor.\n\nWe began an email correspondence. I told him what plans I hoped to do, he suggested some and he came up with a plan. 2 boat trips (Maddalena Archipelago and The Gulf of Orsei) and a cooking class!\n\nHe made all the arrangements (even wetsuits as the ocean temperature was still quite cold in May), communicated efficiently and was available for all of my questions.\n\nI cannot recommend Claudio and Sardinia Discovery Travels enough!"
  },
  {
    "photo": "/google-reviews/photos/joseph-costa.png",
    "avatar": "",
    "initials": "JC",
    "name": "Joseph Costa",
    "stars": 5,
    "date": "11 months ago",
    "shortQuote": "We had the best trip to Sardinia thanks to Claudio and the itinerary he planned for us.",
    "fullText": "We had the best trip to Sardinia thanks to Claudio and the itinerary he planned for us.\nThe hotels were wonderful, and the boat excursions we did to beautiful islands and caves were so much fun. The private wine tasting and tour of Palau was wonderful. We also loved our day on the farm with all the animals and the owners who were making cheese. Claudio went above and beyond if we had a problem or concern, and was always available to help us. We highly recommend Claudio and his company for your trip to Sardinia. We will definitely be going back in the future to see some other area areas of Sardinia!"
  }
];

// Inline multicolor Google G; used for the corner badge and the source line.
const googleG = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.02 46.98 31.85 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.78-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const rating = stars => `<span class="stars" role="img" aria-label="${stars} out of 5 stars"><span aria-hidden="true">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span></span>`;

class GoogleReviews extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <link rel="stylesheet" href="${new URL('./reviews.css', import.meta.url)}">
      <section aria-labelledby="reviews-heading">
        <!-- Match the experiences section: uppercase eyebrow and large, tight heading. -->
        <p class="reviews-eyebrow">Guest stories</p>
        <h2 id="reviews-heading">Loved by those who believe<br> <span>adventure is mandatory.</span></h2>
        <div class="cards">${reviews.map(review => `
          <a class="card" href="${escapeHTML(GOOGLE_REVIEWS_URL)}" target="_blank" rel="noopener noreferrer" aria-label="Read ${escapeHTML(review.name)}'s ${review.stars}-star Google review (opens in a new tab)">
            <figure>
              <img class="photo" src="${escapeHTML(review.photo)}" alt="" loading="lazy" width="800" height="1067">
              <!-- Default photo overlay and always-visible Google badge. -->
              <span class="badge">${googleG}</span>
              <figcaption class="quote">${rating(review.stars)}<p>${escapeHTML(review.shortQuote)}</p></figcaption>
              <!-- Whole-card links work with a single native tap; no touch interception. -->
              <div class="panel" tabindex="0" role="region" aria-label="Full review by ${escapeHTML(review.name)}">
                <div class="reviewer">
                  <span class="avatar initials" aria-hidden="true">${escapeHTML(review.initials)}</span>
                  <div><strong>${escapeHTML(review.name)}</strong><span class="source">${googleG} Google${review.date ? ` · ${escapeHTML(review.date)}` : ''}</span></div>
                </div>
                ${rating(review.stars)}
                <p class="full-text">${escapeHTML(review.fullText)}</p>
              </div>
            </figure>
          </a>`).join('')}</div>
      </section>`;
  }
}
if (!customElements.get('google-reviews')) customElements.define('google-reviews', GoogleReviews);
