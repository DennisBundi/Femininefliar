const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/feminine_flair_ke" },
  { label: "TikTok", href: "https://www.tiktok.com/@feminine_flair_ke0" },
  { label: "Facebook", href: "https://www.facebook.com/share/1BTd8BnB2q/" },
];

export function SocialStrip() {
  return (
    <section className="flex items-center justify-between bg-blush-soft px-8 py-8">
      <p>As seen on our socials — @feminine_flair_ke</p>
      <div className="flex gap-4">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
        ))}
      </div>
    </section>
  );
}
