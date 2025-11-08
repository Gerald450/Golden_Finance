"use client";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function SalesInvestmentChart({ data }:{ data:{ date:string; sales:number; investedCum:number }[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
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
            yAxisId="left" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            width={50}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            width={50}
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
          <Legend 
            wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }}
            iconType="rect"
          />
          <Bar 
            yAxisId="left" 
            dataKey="sales" 
            fill="#fbbf24"
            name="Sales ($)"
            radius={[2, 2, 0, 0]}
          />
          <Line 
            yAxisId="right" 
            dataKey="investedCum" 
            stroke="#00e3b3"
            strokeWidth={3}
            dot={{ fill: '#00e3b3', strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: '#00e3b3', stroke: '#fff', strokeWidth: 2 }}
            name="Investment ($)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
