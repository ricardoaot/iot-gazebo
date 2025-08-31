"use client";

import { useEffect, useState } from "react";
import { fetchSensors } from "@/lib/api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface SensorData {
  id: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export default function Dashboard() {
  const [data, setData] = useState<SensorData[]>([]);
  const [limit, setLimit] = useState(20);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const loadData = async () => {
    try {
      const sensors = await fetchSensors({ limit, from, to });
      setData(sensors.reverse()); // mostrar en orden cronológico
    } catch (err) {
      console.error("Error cargando datos", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [limit, from, to]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">📊 IoT Dashboard</h1>

      {/* Filtros */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          loadData();
        }}
        className="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-xl shadow"
      >
        <div>
          <label className="block text-sm font-medium">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Límite</label>
          <input
            type="number"
            value={limit}
            min={1}
            max={100}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
        >
          Aplicar
        </button>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Temperatura (°C)</th>
              <th className="px-4 py-2">Humedad (%)</th>
              <th className="px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="text-center border-t">
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.temperature}</td>
                <td className="px-4 py-2">{row.humidity}</td>
                <td className="px-4 py-2">
                  {new Date(row.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gráfico */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(v) => new Date(v).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip labelFormatter={(v) => new Date(v).toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
            <Line type="monotone" dataKey="humidity" stroke="#387908" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}