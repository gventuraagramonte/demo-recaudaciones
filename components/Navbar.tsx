'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname()

    const links = [
        { path: '/clientes', name: 'Clientes' },
        { path: '/empresas', name: 'Empresas' },
        { path: '/cuentas', name: 'Cuentas' },
        { path: '/transacciones', name: 'Transacciones' },
    ]

    return (
        <nav className="bg-slate-900 text-white shadow-md px-8 py-4 w-full">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-xl font-bold tracking-tight">Sistema de Pagos</div>
                <ul className="flex gap-6">
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link
                                href={link.path}
                                className={`hover:text-green-400 transition-colors ${pathname === link.path ? 'text-green-400 font-semibold underline' : ''
                                    }`}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>

    )
}