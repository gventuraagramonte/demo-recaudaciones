'use client'

import React, { useEffect, useState } from "react"

type Cliente = {
    id: string,
    dni: string,
    nombres: string,
    correo: string,
    telefono: string,
}

export default function ClientesPage() {
    const [form, setForm] = useState({
        dni: "",
        nombres: "",
        correo: "",
        telefono: "",
    })

    const [clientes, setClientes] = useState<Cliente[]>([])
    const [mensaje, setMensaje] = useState("")

    // Obtener clientes al cargar
    useEffect(() => {
        obtenerClientes()
    }, [])

    const obtenerClientes = async () => {
        try {
            const res = await fetch("http://localhost:3000/cliente")
            const data = await res.json()
            setClientes(data)
        } catch (error) {
            console.error("Error al obtener clientes:", error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:3000/cliente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })
            if (res.ok) {
                setMensaje("✅ Cliente registrado exitosamente.")
                setForm({
                    dni: "",
                    nombres: "",
                    correo: "",
                    telefono: ""
                })
                obtenerClientes()
                setTimeout(() => setMensaje(""), 3000) // Limpiar mensaje después de 3 segundos
            } else {
                setMensaje("❌ Error al registrar cliente.")
                setTimeout(() => setMensaje(""), 3000) // Limpiar mensaje después de 3 segundos
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Registrar Cliente</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="dni" value={form.dni} placeholder="DNI" onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="nombres" value={form.nombres} placeholder="Nombres" onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="correo" value={form.correo} placeholder="Correo" onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="telefono" value={form.telefono} placeholder="Teléfono" onChange={handleChange} className="w-full border p-2 rounded" />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Crear Cliente
                    </button>
                </form>
                {mensaje && <p className="mt-2 text-sm text-green-600">{mensaje}</p>}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Clientes registrados</h3>
                {clientes.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay clientes registrados aún.</p>
                ) : (
                    <ul className="space-y-2">
                        {clientes.map((cliente) => (
                            <li key={cliente.id} className="border p-3 rounded">
                                <strong>{cliente.nombres}</strong> — DNI: {cliente.dni}, Tel: {cliente.telefono}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    )
}