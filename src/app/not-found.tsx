import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-blue-100 via-transparent to-transparent pb-12 pt-20 sm:pb-16 sm:pt-32 lg:pb-24 xl:pb-32 xl:pt-40"
    >
      <div className="relative z-10">
        <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
          <svg className="h-[60rem] w-[100rem] flex-none stroke-blue-600 opacity-10" aria-hidden="true">
            <defs>
              <pattern id="e9033f3e-f665-41a6-84ef-756f6778e6fe" width="200" height="200" x="50%" y="50%"
                patternUnits="userSpaceOnUse" patternTransform="translate(-100 0)">
                <path d="M.5 200V.5H200" fill="none"></path>
              </pattern>
            </defs>
            <svg x="50%" y="50%" className="overflow-visible fill-blue-500">
              <path d="M-300 0h201v201h-201Z M300 200h201v201h-201Z" strokeWidth="0"></path>
            </svg>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)"></rect>
          </svg>
        </div>
      </div>
      <div className="relative z-20 mx-auto max-w-2xl text-center px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-7xl font-extrabold tracking-tight text-blue-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Página no encontrada</h2>
          <p className="mb-4 text-lg text-gray-700 dark:text-gray-200">
            ¡Oops! No pudimos encontrar la página que buscas.<br />
            En la gestión de mantenimiento de equipos médicos hospitalarios, cada detalle cuenta...<br />
            Pero parece que este enlace no corresponde a ningún equipo o funcionalidad registrada.
          </p>
          <p className="mb-8 text-base text-gray-500 dark:text-gray-400 italic">
            "El cuidado de la tecnología médica es tan importante como el cuidado de los pacientes. <br />
            ¡Sigamos trabajando juntos por un hospital más seguro y eficiente!"
          </p>
          <Link
            href="/"
            className="isomorphic-link isomorphic-link--internal inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Volver al inicio
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 