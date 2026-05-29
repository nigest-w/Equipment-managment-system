import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-blue-900 text-white p-5">

        <h2 className="text-xl font-bold mb-6">
         Lion Bank Equipment System
        </h2>

        <nav className="space-y-4">

          <Link className="block" to="/dashboard">
            Dashboard
          </Link>

          <Link className="block" to="/equipment">
            Equipment
          </Link>

          <Link className="block" to="/assignments">
            Assignments
          </Link>

        </nav>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-100 p-6">
        {children}
      </div>

    </div>
  );
}

export default Layout;