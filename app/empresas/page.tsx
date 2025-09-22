'use client'

import { useEffect, useState } from "react"

type Empresa = {
    id: string
    nombre: string
    ruc: string
}

export default function EmpresasPage() {
    const [form, setForm] = useState({ nombre: '', ruc: '' })
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        obtenerEmpresas()
    }, [])

    const obtenerEmpresas = async () => {
        try {
            const res = await fetch('http://localhost:3000/empresa')
            const data = await res.json()
            setEmpresas(data)
        } catch (error) {
            console.error('Error al obtener empresas: ', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:3000/empresa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setMensaje('✅ Empresa registrada exitosamente.')
                setForm({ nombre: '', ruc: '' })
                obtenerEmpresas()
                setTimeout(() => setMensaje(''), 3000)
            } else {
                setMensaje('❌ Error al registrar empresa.')
            }
        } catch (error) {
            console.error('Error de red: ', error)
            setMensaje('❌ Error de red.')
        }
    }

    return (
        <main className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Registrar Empresa</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="nombre"
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="ruc"
                        placeholder="RUC"
                        value={form.ruc}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Crear Empresa
                    </button>
                </form>
                {mensaje && <p className="mt-2 text-sm text-green-600">{mensaje}</p>}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Empresas registradas</h3>
                {empresas.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay empresas registradas aún.</p>
                ) : (
                    <ul className="space-y-2">
                        {empresas.map((empresa) => (
                            <li key={empresa.id} className="border p-3 rounded">
                                <strong>{empresa.nombre}</strong> — RUC: {empresa.ruc}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    )
}