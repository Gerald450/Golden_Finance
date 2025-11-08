"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

export default function SVIChart({ data }: { data: { date: string; svi: number }[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#374151" 
            opacity={0.3}
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[80, 130]} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            width={40}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <ReferenceLine 
            y={100} 
            strokeDasharray="4 4" 
            stroke="#6B7280"
            opacity={0.6}
          />
          <Line 
            type="monotone" 
            dataKey="svi" 
            stroke="#00e3b3" 
            strokeWidth={3}
            dot={{ fill: '#00e3b3', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#00e3b3', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
