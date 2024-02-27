export default function Home({
  books,
  stats,
  profile,
}: {
  books: React.ReactNode;
  stats: React.ReactNode;
  profile: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex p-1 min-h-10 items-center bg-zinc-100 border-b border-zinc-200 relative">
        <div className="font-semibold mx-auto">Главная</div>
      </div>
      <div className="flex flex-col">
        {books}
        {stats}
        {profile}
      </div>
    </div>
  );
}
