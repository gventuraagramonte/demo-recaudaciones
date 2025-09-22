'use client'

import { useEffect, useState } from "react"
import { API_BASE } from '@/lib/env'

type Cliente = {
    id: string
    nombres: string
}

type Cuenta = {
    id: string
    numeroCuenta: string
    saldo: number
    moneda: string
    cliente: Cliente
}

export default function CuentasPage() {
    const [form, setForm] = useState({
        numeroCuenta: '',
        saldo: '',
        moneda: 'PEN',
        clienteId: '',
    })

    const [clientes, setClientes] = useState<Cliente[]>([])
    const [cuentas, setCuentas] = useState<Cuenta[]>([])
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        fetchClientes()
        fetchCuentas()
    }, [])

    const fetchClientes = async () => {
        const res = await fetch(`${API_BASE}/cliente`)
        const data = await res.json()
        setClientes(data)
    }

    const fetchCuentas = async () => {
        const res = await fetch(`${API_BASE}/cuenta`)
        const data = await res.json()
        setCuentas(data)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`${API_BASE}/cuenta`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, saldo: parseFloat(form.saldo) }),
            })

            if (res.ok) {
                setMensaje('✅ Cuenta registrada exitosamente.')
                setForm({ numeroCuenta: '', saldo: '', moneda: 'PEN', clienteId: '' })
                fetchCuentas()
                setTimeout(() => setMensaje(''), 3000)
            } else {
                setMensaje('❌ Error al registrar cuenta.')
            }
        } catch (err) {
            console.error(err)
            setMensaje('❌ Error de red.')
        }
    }

    return (
        <main className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Registrar Cuenta</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="numeroCuenta"
                        placeholder="Número de cuenta"
                        value={form.numeroCuenta}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="saldo"
                        placeholder="Saldo"
                        type="number"
                        value={form.saldo}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <select
                        name="moneda"
                        value={form.moneda}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="PEN">PEN (Soles)</option>
                        <option value="USD">USD (Dólares)</option>
                        <option value="EUR">EUR (Euros)</option>
                    </select>
                    <select
                        name="clienteId"
                        value={form.clienteId}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Selecciona un cliente</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombres}
                            </option>
                        ))}
                    </select>

                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Crear Cuenta
                    </button>
                </form>
                {mensaje && <p className="mt-2 text-sm text-green-600">{mensaje}</p>}
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Cuentas registradas</h3>
                {cuentas.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay cuentas aún.</p>
                ) : (
                    <ul className="space-y-2">
                        {cuentas.map((cuenta) => (
                            <li key={cuenta.id} className="border p-3 rounded">
                                <strong>{cuenta.numeroCuenta}</strong> — {cuenta.moneda} {cuenta.saldo} — Cliente: {cuenta.cliente.nombres}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    )
}