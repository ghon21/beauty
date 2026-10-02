import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-serif text-[9rem] italic leading-none text-rose/30">404</p>
        <h1 className="h-display -mt-6 text-5xl">This page has faded away</h1>
        <p className="mt-4 text-mute">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/shop" className="btn-primary mt-8">Back to shopping</Link>
      </div>
    </div>
  );
}
