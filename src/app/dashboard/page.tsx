
"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Activity, 
  AlertTriangle, 
  Thermometer, 
  Wifi, 
  Users, 
  Info, 
  Download,
  User,
  Clover,
  Milk,
  Battery,
  ShieldAlert,
  Search,
  LogOut,
  ShieldCheck,
  MapPin,
  Zap
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar
} from 'recharts'
import { AIChat } from '@/components/dashboard/ai-chat'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { PlaceHolderImages } from '@/lib/placeholder-images'

// Static Data
const thermalData = [
  { time: '00:00', temp: 38.5 }, { time: '04:00', temp: 38.2 },
  { time: '08:00', temp: 39.1 }, { time: '12:00', temp: 39.5 },
  { time: '16:00', temp: 39.2 }, { time: '20:00', temp: 38.8 },
  { time: '23:59', temp: 38.6 }
]

const staffListInitial = [
  { id: 1, name: 'Robert Smith', role: 'Head Herder', status: 'Active' },
  { id: 2, name: 'Karla Davis', role: 'Veterinarian', status: 'On-Call' },
  { id: 3, name: 'James Wilson', role: 'IoT Tech', status: 'Active' },
  { id: 4, name: 'Maria Garcia', role: 'Nutritionist', status: 'On-Call' },
  { id: 5, name: 'David Lee', role: 'Emergency Lead', status: 'Active' },
]

const sensors = [
  { id: 'Tag-001', cow: 'BW-452', status: 'Online', battery: 85, signal: 'Strong', calib: 'Valid' },
  { id: 'Tag-002', cow: 'BW-110', status: 'Online', battery: 12, signal: 'Weak', calib: 'Pending' },
  { id: 'Tag-003', cow: 'BW-098', status: 'Offline', battery: 0, signal: 'N/A', calib: 'Invalid' },
  { id: 'Tag-004', cow: 'BW-221', status: 'Online', battery: 92, signal: 'Strong', calib: 'Valid' },
  { id: 'Tag-005', cow: 'BW-333', status: 'Online', battery: 45, signal: 'Moderate', calib: 'Valid' },
]

export default function Dashboard() {
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [liveActivity, setLiveActivity] = useState<any[]>([])
  const [staffList, setStaffList] = useState(staffListInitial)

  const cowProfileImg = PlaceHolderImages.find(img => img.id === 'cow-profile');

  // Live graph logic for Individual Health Tab
  useEffect(() => {
    const generateInitialData = () => {
      return Array.from({ length: 20 }, (_, i) => ({
        time: i,
        walking: 30 + Math.random() * 20,
        eating: 10 + Math.random() * 30,
        sleeping: 5 + Math.random() * 10
      }))
    }
    setLiveActivity(generateInitialData())

    const interval = setInterval(() => {
      setLiveActivity(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          walking: 30 + Math.random() * 20,
          eating: 10 + Math.random() * 30,
          sleeping: 5 + Math.random() * 10
        }]
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (emergencyMode) {
      setStaffList(prev => prev.map(s => ({ ...s, status: 'Alerted/Active' })))
    } else {
      setStaffList(staffListInitial)
    }
  }, [emergencyMode])

  const exportLogs = () => {
    const csvContent = "data:text/csv;charset=utf-8,Time,Event,Value\n2023-10-27 10:00,Fever Alert,39.5C\n2023-10-27 11:00,Low Battery,Tag-002"
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "cattle_logs.csv")
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      {/* Red Warning Banner for Emergency */}
      {emergencyMode && (
        <div className="bg-destructive text-destructive-foreground py-2 px-4 flex items-center justify-center gap-2 animate-pulse font-bold sticky top-0 z-50">
          <ShieldAlert className="h-5 w-5" />
          CRITICAL: EMERGENCY SHIFT ENABLED. ALL STAFF ALERTED.
        </div>
      )}

      {/* Header */}
      <header className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 z-40 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <Clover className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight neon-text-emerald">Cattle Health 360</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={exportLogs} className="hidden sm:flex gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium">Dr. Farmly</p>
              <p className="text-[10px] text-muted-foreground">Admin Access</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-white/20">
              <User className="h-5 w-5 text-secondary-foreground" />
            </div>
            <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <Link href="/login">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        <Tabs defaultValue="snapshot" className="space-y-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="bg-muted/50 p-1 mb-2 inline-flex">
              <TabsTrigger value="snapshot">Herd Snapshot</TabsTrigger>
              <TabsTrigger value="alerts">Health Alerts</TabsTrigger>
              <TabsTrigger value="kpis">Vitality KPIs</TabsTrigger>
              <TabsTrigger value="sensors">Sensor Status</TabsTrigger>
              <TabsTrigger value="health-check">Health Check</TabsTrigger>
              <TabsTrigger value="thermal">Thermal Analysis</TabsTrigger>
              <TabsTrigger value="staff">Staff & Emergency</TabsTrigger>
              <TabsTrigger value="individual">Individual Cow</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Tab 1: Snapshot */}
          <TabsContent value="snapshot" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-300">
            <SnapshotCard title="Total Head" value="1,248" icon={<Users className="text-primary" />} trend="+2% from last month" />
            <SnapshotCard title="Critical Alerts" value="03" icon={<AlertTriangle className="text-destructive" />} trend="Requires attention" color="text-destructive" />
            <SnapshotCard title="In Heat" value="12" icon={<Activity className="text-secondary" />} trend="Sync tracking active" />
            <SnapshotCard title="Health Score" value="94%" icon={<ShieldAlert className="text-primary" />} trend="Above industry avg" />
            
            <Card className="lg:col-span-3 glass-card p-6">
              <CardHeader className="px-0">
                <CardTitle className="text-lg">Recent Alerts Feed</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <AlertItem type="Fever" cow="BW-452" time="2 mins ago" severity="High" />
                <AlertItem type="Geofence Exit" cow="BW-110" time="15 mins ago" severity="Medium" />
                <AlertItem type="Low Rumination" cow="BW-098" time="1 hour ago" severity="Low" />
              </div>
            </Card>

            <Card className="lg:col-span-1 glass-card p-6 flex flex-col justify-center text-center border-primary/20 bg-primary/5">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-primary mb-1">18 Cows</h3>
              <p className="text-sm font-bold text-foreground mb-1 uppercase tracking-tighter">Recovered / Cured</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Successfully Treated after Early Detection</p>
            </Card>

            <div className="lg:col-span-4 glass-card p-4 flex flex-wrap items-center gap-4 justify-center bg-secondary/5 border-secondary/10">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-2">Deployed Sensor Tech Stack:</div>
              <div className="flex items-center gap-2 px-3 py-1 bg-background/50 rounded-full border border-white/5">
                <Thermometer className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-medium">DS18B20 (Thermal)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-background/50 rounded-full border border-white/5">
                <Activity className="h-3 w-3 text-secondary" />
                <span className="text-[10px] font-medium">MPU6050 (Motion)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-background/50 rounded-full border border-white/5">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-medium">Neo-6M (GPS)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-background/50 rounded-full border border-white/5">
                <Zap className="h-3 w-3 text-secondary" />
                <span className="text-[10px] font-medium">PulseOx</span>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Health Alerts */}
          <TabsContent value="alerts" className="space-y-4 animate-in slide-in-from-left-5 duration-300">
             <Card className="glass-card">
              <CardHeader>
                <CardTitle>Live Health Alerts</CardTitle>
                <CardDescription>Real-time feed from all wearable sensors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-background/40 border border-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-md ${i === 1 ? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'}`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Cow #BW-{100 + i} Alert</p>
                        <p className="text-xs text-muted-foreground">{i % 2 === 0 ? 'Fever detected (39.8C)' : 'Unusual inactivity detected'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{i * 5} mins ago</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-primary">View Details</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
             </Card>
          </TabsContent>

          {/* Tab 3: Vitality KPIs */}
          <TabsContent value="kpis" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-right-5 duration-300">
            <KPICard title="Avg Body Temp" value="38.5°C" subtitle="Normal range" icon={<Thermometer className="text-primary" />} chartColor="hsl(var(--primary))" />
            <KPICard title="Rumination Time" value="480m" subtitle="Avg / 24h" icon={<Activity className="text-secondary" />} chartColor="hsl(var(--secondary))" />
            <KPICard title="Milk Yield" value="32.4L" subtitle="Avg / animal" icon={<Milk className="text-primary" />} chartColor="hsl(var(--primary))" />
          </TabsContent>

          {/* Tab 4: Sensor Status */}
          <TabsContent value="sensors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Network Gateways</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <GatewayStatus name="North Pasture Hub" status="Online" signal={92} />
                    <GatewayStatus name="South Barn Bridge" status="Online" signal={78} />
                    <GatewayStatus name="Feeding Area Gateway" status="Offline" signal={0} />
                  </CardContent>
               </Card>
               <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Battery Health Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{n: 'Low', v: 12}, {n: 'Med', v: 45}, {n: 'Good', v: 156}]}>
                        <Bar dataKey="v" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <XAxis dataKey="n" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
               </Card>
            </div>
          </TabsContent>

          {/* Tab 5: Health Check */}
          <TabsContent value="health-check" className="animate-in fade-in duration-300">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sensor Inventory & Calibration</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tag ID..." className="pl-8 h-9" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/30">
                      <tr>
                        <th className="px-4 py-3">Tag ID</th>
                        <th className="px-4 py-3">Cow Assigned</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Battery</th>
                        <th className="px-4 py-3">Signal</th>
                        <th className="px-4 py-3">Calibration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sensors.map(s => (
                        <tr key={s.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs">{s.id}</td>
                          <td className="px-4 py-3">{s.cow}</td>
                          <td className="px-4 py-3">
                            <Badge variant={s.status === 'Online' ? 'default' : 'destructive'} className="text-[10px]">
                              {s.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Battery className={`h-3 w-3 ${s.battery < 20 ? 'text-destructive' : 'text-primary'}`} />
                              {s.battery}%
                            </div>
                          </td>
                          <td className="px-4 py-3">{s.signal}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`text-[10px] ${s.calib === 'Valid' ? 'text-primary border-primary/20' : 'text-muted-foreground'}`}>
                              {s.calib}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 6: Thermal */}
          <TabsContent value="thermal" className="space-y-6">
            <Card className="glass-card h-[400px]">
              <CardHeader>
                <CardTitle>Herd Thermal Trend</CardTitle>
                <CardDescription>Aggregate body temperature over 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="h-full pb-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={thermalData}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" />
                    <YAxis domain={[37, 40]} stroke="#ffffff50" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTemp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 7: Staff */}
          <TabsContent value="staff" className="space-y-6">
            <div className="flex items-center justify-between glass-card p-6 rounded-lg">
              <div>
                <h3 className="text-xl font-bold">Emergency Operations Center</h3>
                <p className="text-sm text-muted-foreground">Manage on-site personnel and system-wide alerts</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-bold ${emergencyMode ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {emergencyMode ? 'EMERGENCY MODE ON' : 'Normal Operations'}
                </span>
                <Button 
                  variant={emergencyMode ? "destructive" : "outline"} 
                  onClick={() => setEmergencyMode(!emergencyMode)}
                  className="font-bold border-2"
                >
                  {emergencyMode ? 'DISABLE EMERGENCY SHIFT' : 'ENABLE EMERGENCY SHIFT'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map(staff => (
                <Card key={staff.id} className="glass-card overflow-hidden group">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold border border-white/10">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <CardTitle className="text-base">{staff.name}</CardTitle>
                      <CardDescription>{staff.role}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <Badge variant={staff.status === 'Active' || staff.status === 'Alerted/Active' ? 'default' : 'secondary'}>
                      {staff.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">Contact</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 8: Individual Health */}
          <TabsContent value="individual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="glass-card lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-primary/20">
                      <Image 
                        src={cowProfileImg?.imageUrl || 'https://picsum.photos/seed/cow/200/200'} 
                        alt="Cow profile" 
                        fill 
                        className="object-cover"
                        data-ai-hint={cowProfileImg?.imageHint || 'cow profile'}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Cow #BW-452</CardTitle>
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Digital Twin Active</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailRow label="Breed" value="Holstein Friesian" />
                  <DetailRow label="Age" value="4.2 Years" />
                  <DetailRow label="Weight" value="680 kg" />
                  <DetailRow label="Last Calving" value="Aug 12, 2023" />
                  <DetailRow label="Sensor ID" value="Tag-001" />
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Health Summary</p>
                    <p className="text-sm leading-relaxed">Maintaining stable metabolic rates. Rumination cycles consistent with high-yield performance profiles.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Live Motion Feed</CardTitle>
                    <CardDescription>Accelerated activity profiling (Walking/Eating/Sleeping)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> <span className="text-[10px]">Walking</span></div>
                    <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-secondary" /> <span className="text-[10px]">Eating</span></div>
                  </div>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={liveActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                      <XAxis dataKey="time" hide />
                      <YAxis stroke="#ffffff20" fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                        itemStyle={{ fontSize: '10px' }}
                      />
                      <Line type="monotone" dataKey="walking" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="eating" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="sleeping" stroke="#ffffff30" strokeWidth={1} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Legend / Tips Section */}
        <Card className="glass-card p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /> Healthy / Normal</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-destructive" /> Critical Alert</div>
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-secondary" /> Interaction Required</div>
            <div className="ml-auto flex items-center gap-1 font-bold"><Info className="h-3 w-3" /> Dashboard Tip: Double-tap any sensor ID to view full 3D Digital Twin.</div>
          </div>
        </Card>
      </main>

      <AIChat />

      <footer className="p-4 border-t border-white/10 text-center text-muted-foreground text-[10px] bg-card/20 backdrop-blur-sm">
        ⚠️ Prototype v1.0 • For Demonstration Purposes Only • Cattle Health 360 AI Engine v2.5
      </footer>
    </div>
  );
}

// Subcomponents
function SnapshotCard({ title, value, icon, trend, color = "text-primary" }: any) {
  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="p-2 bg-muted/50 rounded-lg">{icon}</div>
        </div>
        <h3 className={`text-3xl font-bold font-headline mb-1 ${color}`}>{value}</h3>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          {trend}
        </p>
      </CardContent>
    </Card>
  )
}

function KPICard({ title, value, subtitle, icon, chartColor }: any) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // Initial live-simulated data
    setChartData(Array.from({length: 12}, () => ({v: 5 + Math.random() * 5})))

    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1), { v: 5 + Math.random() * 5 }]
        return newData
      })
    }, 2000) // Update every 2 seconds for visibility

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
        <div className="h-12 w-full">
           <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke={chartColor} 
                fill={chartColor} 
                fillOpacity={0.1} 
                dot={false} 
                isAnimationActive={true}
                animationDuration={1500}
              />
            </AreaChart>
           </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function GatewayStatus({ name, status, signal }: any) {
  return (
    <div className="flex items-center justify-between p-3 border border-white/5 rounded-lg">
      <div className="flex items-center gap-3">
        <Wifi className={`h-4 w-4 ${status === 'Online' ? 'text-primary' : 'text-muted-foreground'}`} />
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[10px] text-muted-foreground">{status}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-mono">{signal}%</p>
        <div className="w-16 h-1 bg-muted rounded-full mt-1">
          <div className="h-full bg-primary rounded-full" style={{ width: `${signal}%` }} />
        </div>
      </div>
    </div>
  )
}

function AlertItem({ type, cow, time, severity }: any) {
  const severityColor = {
    High: 'text-destructive border-destructive/20 bg-destructive/5',
    Medium: 'text-orange-400 border-orange-400/20 bg-orange-400/5',
    Low: 'text-secondary border-secondary/20 bg-secondary/5'
  }[severity as 'High'|'Medium'|'Low']

  return (
    <div className={`p-3 border rounded-lg flex items-center justify-between ${severityColor}`}>
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-4 w-4" />
        <div>
          <p className="text-sm font-bold">{type}</p>
          <p className="text-[10px] opacity-80">Cow assigned: {cow}</p>
        </div>
      </div>
      <span className="text-[10px] opacity-60 font-medium">{time}</span>
    </div>
  )
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
