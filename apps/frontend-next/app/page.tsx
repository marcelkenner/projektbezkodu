export const revalidate = 300;
export default async function Home() {
  const base = process.env.NEXT_PUBLIC_CMS_BASE ?? '';
  let data: any = {};
  try {
    const res = await fetch(${base}/api/posts?populate=*, { next: { revalidate }});
    data = await res.json();
  } catch (e) {}
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-blue-600">Welcome to projektbezkodu.example.com</h1>
      <pre className="text-xs bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
