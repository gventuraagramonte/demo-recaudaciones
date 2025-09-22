'use client'

import { useEffect, useState } from "react"

interface Empresa {
    id: string
    nombre: string
}

interface Cuenta {
    id: string
    numeroCuenta: string
    moneda: string
}

interface Transaccion {
    id: string
    monto: number
    moneda: string
    estado: string
    empresa: Empresa
    cuenta: Cuenta
    createdAt: string
}

export default function TransaccionesPage() {
    const [monto, setMonto] = useState<number>(0)
    const [moneda, setMoneda] = useState<string>('PEN')
    const [empresaId, setEmpresaId] = useState<string>('')
    const [cuentaId, setCuentaId] = useState<string>('')
    const [empresas, setEmpresas] = useState<Empresa[]>([])
    const [cuentas, setCuentas] = useState<Cuenta[]>([])
    const [transacciones, setTransacciones] = useState<Transaccion[]>([])
    const [mensaje, setMensaje] = useState<string>('')

    useEffect(() => {
        fetch('http://localhost:3000/empresa')
            .then(res => res.json())
            .then(setEmpresas)
            .catch(err => console.error('Error al cargar empresas:', err));

        fetch('http://localhost:3000/cuenta')
            .then(res => res.json())
            .then(setCuentas)
            .catch(err => console.error('Error al cargar cuentas:', err));
        cargarTransacciones()
    }, [])

    const cargarTransacciones = () => {
        fetch('http://localhost:3000/transaccion')
            .then(res => res.json())
            .then(setTransacciones)
            .catch(err => console.error('Error al cargar transacciones:', err))
    }

    const registrarTransaccion = async () => {
        const transaccion = {
            monto,
            moneda,
            estado: 'PENDIENTE',
            empresaId,
            cuentaId
        };

        try {
            const res = await fetch('http://localhost:3000/transaccion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaccion),
            });

            if (res.ok) {
                console.log(JSON.stringify(transacciones))
                setMensaje('✅ Transacción registrada con éxito');
                // Limpiar campos
                setMonto(0);
                setEmpresaId('');
                setCuentaId('');
                cargarTransacciones()
            } else {
                const error = await res.json();
                setMensaje(`❌ Error: ${error.message || 'No se pudo registrar'}`);
            }
        } catch (err) {
            console.error(err);
            setMensaje('❌ Error al conectar con el servidor');
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-4 border rounded shadow space-y-10">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Registrar Transacción</h1>

                <input
                    type="number"
                    placeholder="Monto"
                    value={monto}
                    onChange={e => setMonto(Number(e.target.value))}
                    className="w-full border px-3 py-2 rounded"
                />

                <select
                    value={moneda}
                    onChange={e => setMoneda(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="PEN">Soles (PEN)</option>
                    <option value="USD">Dólares (USD)</option>
                </select>

                <select
                    value={empresaId}
                    onChange={e => setEmpresaId(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Selecciona una Empresa</option>
                    {empresas.map(e => (
                        <option key={e.id} value={e.id}>
                            {e.nombre}
                        </option>
                    ))}
                </select>

                <select
                    value={cuentaId}
                    onChange={e => setCuentaId(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">Selecciona una Cuenta</option>
                    {cuentas.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.numeroCuenta} - {c.moneda}
                        </option>
                    ))}
                </select>

                <button
                    onClick={registrarTransaccion}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Crear Transacción
                </button>

                {mensaje && <p className="text-sm font-semibold">{mensaje}</p>}
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Transacciones Registradas</h2>
                <div className="overflow-auto">
                    <table className="min-w-full text-sm border">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="border px-3 py-2 text-left">Monto</th>
                                <th className="border px-3 py-2 text-left">Moneda</th>
                                <th className="border px-3 py-2 text-left">Empresa</th>
                                <th className="border px-3 py-2 text-left">Cuenta</th>
                                <th className="border px-3 py-2 text-left">Estado</th>
                                <th className="border px-3 py-2 text-left">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transacciones.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50">
                                    <td className="border px-3 py-2">{t.monto}</td>
                                    <td className="border px-3 py-2">{t.moneda}</td>
                                    <td className="border px-3 py-2">{t.empresa?.nombre}</td>
                                    <td className="border px-3 py-2">{t.cuenta?.numeroCuenta}</td>
                                    <td className={`border px-3 py-2 font-semibold ${t.estado === 'EXITOSA' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.estado}
                                    </td>
                                    <td className="border px-3 py-2">{new Date(t.createdAt).toLocaleString('es-PE')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}