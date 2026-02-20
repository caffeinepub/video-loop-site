import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function MetricsDashboard() {
  // Ossification Timelines data matching the reference image
  const ossificationData = [
    { name: 'Distal Radius', female: 18, male: 19 },
    { name: 'Distal Ulna', female: 17, male: 19 },
    { name: '5th Metatarsal', female: 14, male: 16 },
    { name: 'Distal Tibia', female: 14, male: 17 },
  ];

  // Suchey-Brooks Phase Probabilities data matching the reference image
  const sucheyBrooksData = [
    { phase: 'Phase I', age: 23 },
    { phase: 'Phase II', age: 28 },
    { phase: 'Phase III', age: 30 },
    { phase: 'Phase IV', age: 35 },
    { phase: 'Phase V', age: 45 },
    { phase: 'Phase VI', age: 61 },
  ];

  return (
    <section className="bg-[#0a0f1a] py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Metric Reference Standards
            </h2>
            <p className="text-lg text-gray-400">
              Comparative analysis of ossification timelines and morphological shifts.
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Ossification Timelines Chart */}
            <div className="rounded-lg border border-slate-800 bg-[#0f1623] p-6">
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Ossification Timelines (Years)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ossificationData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={{ stroke: '#64748b' }}
                  />
                  <YAxis 
                    domain={[0, 20]}
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={{ stroke: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#e2e8f0'
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend 
                    wrapperStyle={{ color: '#94a3b8' }}
                    iconType="rect"
                  />
                  <Bar 
                    dataKey="female" 
                    name="Female Fusion Age" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="male" 
                    name="Male Fusion Age" 
                    fill="#6b7280" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Suchey-Brooks Phase Probabilities Chart */}
            <div className="rounded-lg border border-slate-800 bg-[#0f1623] p-6">
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Suchey-Brooks Phase Probabilities
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={sucheyBrooksData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="phase" 
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={{ stroke: '#64748b' }}
                  />
                  <YAxis 
                    domain={[20, 65]}
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickLine={{ stroke: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#e2e8f0'
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend 
                    wrapperStyle={{ color: '#94a3b8' }}
                    iconType="line"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="age" 
                    name="Mean Age (Male)"
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#3b82f6' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
