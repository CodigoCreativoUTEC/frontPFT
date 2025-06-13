export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      
        <div className="bg-gradient-to-b from-blue-100 via-transparent to-transparent pb-12 pt-10 sm:pb-16 sm:pt-10 lg:pb-24 xl:pb-32 xl:pt-10 flex items-center justify-center min-h-screen">
          {/* Puedes agregar un diseño especial aquí */}
          <main className="w-full max-w-md p-4 bg-white rounded shadow-md">
            {children}
          </main>
        </div>
      
    );
  }
  