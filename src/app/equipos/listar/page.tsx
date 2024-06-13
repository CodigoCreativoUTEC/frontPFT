
async function getData() {
    const res = await fetch('http://wildfly:8080/ServidorApp-1.0-SNAPSHOT/api/equipos/ListarTodosLosEquipos')
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
  }
   
  export default async function Page() {
    const data = await getData()
    console.log(data)
   
    return (


        <div className="bg-white">
  <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Listado de equipos</h2>
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
    {data.map((equipo: { id: number, nombre: string, estado: string, imagen: string }) => (
    
        // eslint-disable-next-line react/jsx-key
      <div className="group relative">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
            <img src={equipo.imagen} alt="Front of mens Basic Tee in black." className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <a href="#">
                <span aria-hidden="true" className="absolute inset-0"></span>
                {equipo.nombre}
              </a>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{equipo.estado}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">ID: {equipo.id}</p>
        </div>
      </div>
      
    ))}
      </div>
    
  </div>
</div>



       /* <div className="grid grid-cols-3 gap-4">
            {data.map((equipo: { id: number, nombre: string, description: string }) => (
                <div key={equipo.id} className="bg-white p-4 shadow-md">
                    <h2 className="text-xl font-bold">{equipo.nombre}</h2>
                    <p>{equipo.description}</p>
                </div>
            
        </div>/*/




            
    );
  }