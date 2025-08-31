import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchSensors(params: {
  from?: string;
  to?: string;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params.from) query.append("from", params.from);
  if (params.to) query.append("to", params.to);
  if (params.limit) query.append("limit", params.limit.toString());

  const res = await axios.get(`http://localhost:3001/sensors?${query.toString()}`);
  return res.data;
}