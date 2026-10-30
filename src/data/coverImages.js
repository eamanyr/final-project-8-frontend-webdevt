// Course cover images are served locally from /public/covers so they never break
// when a remote image host removes or blocks a photo.
export const DEFAULT_COURSE_COVER = '/covers/abstract-art.jpg';

export const COVER_PRESETS = [
  { label: 'Abstract Art', url: '/covers/abstract-art.jpg' },
  { label: 'Sketching', url: '/covers/sketching.jpg' },
  { label: 'Typography', url: '/covers/typography.jpg' },
  { label: 'Web UI / Dev', url: '/covers/web-dev.jpg' },
];

// Remote URLs that were used before (some of them now return 404) mapped to the local copies.
const LEGACY_COVER_MAP = {
  'photo-1579783902614-a3fb3927b675': '/covers/abstract-art.jpg',
  'photo-1547891654-e66ed7ebb968': '/covers/abstract-art.jpg',
  'photo-1513364776144-60967b0f800f': '/covers/sketching.jpg',
  'photo-1544716278-ca5e3f4abd8c': '/covers/typography.jpg',
  'photo-1555066931-4365d14bab8c': '/covers/web-dev.jpg',
};

// Returns a working cover URL for a stored thumbnail value.
export const resolveCourseCover = (thumbnail) => {
  if (!thumbnail) return DEFAULT_COURSE_COVER;
  const legacyKey = Object.keys(LEGACY_COVER_MAP).find((key) => thumbnail.includes(key));
  return legacyKey ? LEGACY_COVER_MAP[legacyKey] : thumbnail;
};

// <img onError> handler: swap to the local default once, then hide if even that fails.
export const handleCoverError = (e) => {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied) {
    img.style.display = 'none';
    return;
  }
  img.dataset.fallbackApplied = 'true';
  img.src = DEFAULT_COURSE_COVER;
};
