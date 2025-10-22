import Header from '@/components/header';

export default function MetabasePage() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Header />

      {/* Iframe Container - com margin-top para não sobrepor o header */}
      <main className="flex-1 w-full mt-[59px]" style={{ height: 'calc(100vh - 123px)' }}>
        <iframe
          src="http://meta.prompt-master.org/public/dashboard/3dfc519b-4b32-4bc7-b489-e9fd2d4b7c57"
          frameBorder="0"
          allowTransparency
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          allow="fullscreen"
          className="w-full h-full border-0"
          title="Metabase Dashboard"
        />
      </main>
    </div>
  );
}
