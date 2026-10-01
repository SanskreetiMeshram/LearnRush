export const SUBJECTS = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    slug: 'mathematics',
    icon: 'Calculator',
    emoji: '🧮',
    description: 'Challenge your logic and numbers.',
    bgClass: 'bg-sky-bg',
    lightBgClass: 'bg-sky-light',
    accentClass: 'text-sky-dark',
    iconBgClass: 'bg-white text-sky',
    borderClass: 'border-blue-200',
    hoverBorderClass: 'hover:border-blue-400',
    barColor: 'bg-sky',
    badgeClass: 'bg-sky-bg text-sky-dark border-blue-200',
    buttonBgClass: 'bg-sky text-white group-hover:bg-sky-dark',
    hexBg: '#DCEBFF',
    hexAccent: '#3B82F6',
  },
  {
    id: 'science',
    name: 'Science',
    slug: 'science',
    icon: 'FlaskConical',
    emoji: '🧪',
    description: 'Explore physics, chemistry and biology.',
    bgClass: 'bg-mint-bg',
    lightBgClass: 'bg-mint-light',
    accentClass: 'text-mint-dark',
    iconBgClass: 'bg-white text-mint',
    borderClass: 'border-emerald-200',
    hoverBorderClass: 'hover:border-emerald-400',
    barColor: 'bg-mint',
    badgeClass: 'bg-mint-bg text-mint-dark border-emerald-200',
    buttonBgClass: 'bg-mint text-white group-hover:bg-mint-dark',
    hexBg: '#D9F7EA',
    hexAccent: '#10B981',
  },
  {
    id: 'geography',
    name: 'Geography',
    slug: 'geography',
    icon: 'Globe',
    emoji: '🌍',
    description: 'Discover countries, places and our planet.',
    bgClass: 'bg-lavender-bg',
    lightBgClass: 'bg-lavender-light',
    accentClass: 'text-lavender-dark',
    iconBgClass: 'bg-white text-lavender',
    borderClass: 'border-violet-200',
    hoverBorderClass: 'hover:border-violet-400',
    barColor: 'bg-lavender',
    badgeClass: 'bg-lavender-bg text-lavender-dark border-violet-200',
    buttonBgClass: 'bg-lavender text-white group-hover:bg-lavender-dark',
    hexBg: '#EAE4FF',
    hexAccent: '#7C5CFC',
  },
  {
    id: 'history',
    name: 'History',
    slug: 'history',
    icon: 'Landmark',
    emoji: '🏛️',
    description: 'Explore important events and people.',
    bgClass: 'bg-peach-bg',
    lightBgClass: 'bg-peach-light',
    accentClass: 'text-peach-dark',
    iconBgClass: 'bg-white text-peach',
    borderClass: 'border-orange-200',
    hoverBorderClass: 'hover:border-orange-400',
    barColor: 'bg-peach',
    badgeClass: 'bg-peach-bg text-peach-dark border-orange-200',
    buttonBgClass: 'bg-peach text-white group-hover:bg-peach-dark',
    hexBg: '#FFE8D6',
    hexAccent: '#F97316',
  },
];

export function getSubjectByParam(param) {
  if (!param || typeof param !== 'string') return null;
  const normalized = param.trim().toLowerCase();
  return (
    SUBJECTS.find(
      (s) =>
        s.slug.toLowerCase() === normalized ||
        s.name.toLowerCase() === normalized
    ) || null
  );
}
