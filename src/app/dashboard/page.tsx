"use client"

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Zap,
  Cpu,
  Phone,
  ArrowUpRight,
  SearchCode,
  CheckCircle,
  Database,
  Radio,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Legend, ReferenceLine
} from 'recharts'
import { AIChat } from '@/components/dashboard/ai-chat'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

// Static Data
const herdThermalData = [
  { time: '00:00', avgTemp: 38.5 }, { time: '04:00', avgTemp: 38.2 },
  { time: '08:00', avgTemp: 39.1 }, { time: '12:00', avgTemp: 39.5 },
  { time: '16:00', avgTemp: 39.2 }, { time: '20:00', avgTemp: 38.8 },
  { time: '23:59', avgTemp: 38.6 }
]

const cowPerformanceData: Record<string, any> = {
  'BW-452': {
    name: 'Sickly Cow',
    trend: 'Declining',
    healthStatus: 'Critical',
    healthColor: '#ef4444',
    tempData: herdThermalData.map(d => ({ ...d, cowTemp: d.avgTemp + 1.2 + Math.random() * 0.4 })),
    ruminationData: [
      { day: 'Mon', mins: 460 }, { day: 'Tue', mins: 420 }, { day: 'Wed', mins: 350 }, { day: 'Thu', mins: 280 }, { day: 'Fri', mins: 210 }
    ],
    milkData: [
      { day: '1', yield: 28 }, { day: '2', yield: 26 }, { day: '3', yield: 25 }, { day: '4', yield: 22 }, { day: '5', yield: 20 }, { day: '6', yield: 18 }, { day: '7', yield: 15 }
    ]
  },
  'BW-103': {
    name: 'Slow Mover',
    trend: 'Stable',
    healthStatus: 'Attention Required',
    healthColor: '#f59e0b',
    tempData: herdThermalData.map(d => ({ ...d, cowTemp: d.avgTemp + 0.2 + Math.random() * 0.2 })),
    ruminationData: [
      { day: 'Mon', mins: 410 }, { day: 'Tue', mins: 405 }, { day: 'Wed', mins: 415 }, { day: 'Thu', mins: 400 }, { day: 'Fri', mins: 390 }
    ],
    milkData: [
      { day: '1', yield: 30 }, { day: '2', yield: 29 }, { day: '3', yield: 31 }, { day: '4', yield: 30 }, { day: '5', yield: 30 }, { day: '6', yield: 31 }, { day: '7', yield: 30 }
    ]
  },
  'BW-007': {
    name: 'Star Performer',
    trend: 'Improving',
    healthStatus: 'Healthy',
    healthColor: '#10b981',
    tempData: herdThermalData.map(d => ({ ...d, cowTemp: d.avgTemp - 0.1 + Math.random() * 0.1 })),
    ruminationData: [
      { day: 'Mon', mins: 480 }, { day: 'Tue', mins: 490 }, { day: 'Wed', mins: 510 }, { day: 'Thu', mins: 520 }, { day: 'Fri', mins: 505 }
    ],
    milkData: [
      { day: '1', yield: 32 }, { day: '2', yield: 33 }, { day: '3', yield: 34 }, { day: '4', yield: 35 }, { day: '5', yield: 37 }, { day: '6', yield: 38 }, { day: '7', yield: 40 }
    ]
  }
}

const staffListInitial = [
  { id: 1, name: 'Robert Smith', role: 'Head Herder', status: 'Active' },
  { id: 2, name: 'Dr. Steve Wilson', role: 'Veterinarian', status: 'On-Call' },
  { id: 3, name: 'James Wilson', role: 'IoT Tech', status: 'Active' },
  { id: 4, name: 'Maria Garcia', role: 'Nutritionist', status: 'On-Call' },
  { id: 5, name: 'David Lee', role: 'Emergency Lead', status: 'Active' },
]

const hardwareTags = [
  {
    id: 'Tag-001',
    cow: 'Bella',
    type: 'Cow',
    scenario: 'Stable',
    battery: 98,
    signal: -42,
    lastCalib: '2026-01-10',
    modules: {
      accel: { name: 'Accelerometer (MPU6050)', status: 'Operational', statusType: 'success', health: 100, x: 0.02, y: 0.98, z: 0.15, desc: '3-axis movement tracking for lameness & rumination.' },
      thermal: { name: 'Thermal Probe (DS18B20)', status: 'Operational', statusType: 'success', health: 99, val: 38.9, desc: 'Core body temperature monitoring.' },
      heart: { name: 'Heart Rate (Pulse/SpO2)', status: 'Operational', statusType: 'success', health: 95, val: 72, desc: 'Optical photoplethysmography sensor.' },
      lora: { name: 'Transceiver (SX1276 LoRa)', status: 'Sending...', statusType: 'info', health: 100, freq: '868MHz', sf: 'SF7', desc: 'Long-range telemetry uplink.' }
    }
  },
  {
    id: 'Tag-002',
    cow: 'Max',
    type: 'Bull',
    scenario: 'Critical Battery',
    battery: 12,
    signal: -45,
    lastCalib: '2025-12-15',
    modules: {
      accel: { name: 'Accelerometer (MPU6050)', status: 'Low Power', statusType: 'warning', health: 85, x: 0.00, y: 0.00, z: 0.00, desc: 'Restricted sampling rate.' },
      thermal: { name: 'Thermal Probe (DS18B20)', status: 'Operational', statusType: 'success', health: 90, val: 38.5, desc: 'Core body temperature monitoring.' },
      heart: { name: 'Heart Rate (Pulse/SpO2)', status: 'Disabled', statusType: 'destructive', health: 0, val: 0, desc: 'Sensor disabled to conserve power.' },
      lora: { name: 'Transceiver (SX1276 LoRa)', status: 'Low Power', statusType: 'warning', health: 70, freq: '868MHz', sf: 'SF12', desc: 'Extended range mode active.' }
    }
  },
  {
    id: 'Tag-003',
    cow: 'Luna',
    type: 'Calf',
    scenario: 'Calibration Mode',
    battery: 85,
    signal: -50,
    lastCalib: '2026-02-14',
    modules: {
      accel: { name: 'Accelerometer (MPU6050)', status: 'Calibrating', statusType: 'warning', health: 100, x: 0, y: 0, z: 0, desc: 'Zero-point alignment in progress.', isCalib: true },
      thermal: { name: 'Thermal Probe (DS18B20)', status: 'Calibrating', statusType: 'warning', health: 100, val: 0, desc: 'Environmental offset adjustment.', isCalib: true },
      heart: { name: 'Heart Rate (Pulse/SpO2)', status: 'Calibrating', statusType: 'warning', health: 100, val: 0, desc: 'Skin contact verification.', isCalib: true },
      lora: { name: 'Transceiver (SX1276 LoRa)', status: 'Calibrating', statusType: 'warning', health: 100, freq: '868MHz', sf: 'SF7', desc: 'Gateway handshake.', isCalib: true }
    }
  },
  {
    id: 'Tag-004',
    cow: 'Daisy',
    type: 'Cow',
    scenario: 'Sensor Failure',
    battery: 76,
    signal: -48,
    lastCalib: '2025-11-20',
    modules: {
      accel: { name: 'Accelerometer (MPU6050)', status: 'Axis Error', statusType: 'destructive', health: 15, x: 9.99, y: 9.99, z: 9.99, desc: 'MEMS hardware failure detected.' },
      thermal: { name: 'Thermal Probe (DS18B20)', status: 'Operational', statusType: 'success', health: 98, val: 38.7, desc: 'Core body temperature monitoring.' },
      heart: { name: 'Heart Rate (Pulse/SpO2)', status: 'Operational', statusType: 'success', health: 92, val: 75, desc: 'Optical photoplethysmography sensor.' },
      lora: { name: 'Transceiver (SX1276 LoRa)', status: 'Sending...', statusType: 'info', health: 95, freq: '868MHz', sf: 'SF7', desc: 'Long-range telemetry uplink.' }
    }
  },
  {
    id: 'Tag-005',
    cow: 'Rocky',
    type: 'Bull',
    scenario: 'Weak Signal',
    battery: 92,
    signal: -95,
    lastCalib: '2026-01-05',
    modules: {
      accel: { name: 'Accelerometer (MPU6050)', status: 'Operational', statusType: 'success', health: 100, x: 0.12, y: 0.85, z: 0.22, desc: '3-axis movement tracking.' },
      thermal: { name: 'Thermal Probe (DS18B20)', status: 'Operational', statusType: 'success', health: 99, val: 39.1, desc: 'Core body temperature monitoring.' },
      heart: { name: 'Heart Rate (Pulse/SpO2)', status: 'Operational', statusType: 'success', health: 95, val: 68, desc: 'Optical photoplethysmography sensor.' },
      lora: { name: 'Transceiver (SX1276 LoRa)', status: 'Weak Signal', statusType: 'destructive', health: 40, freq: '868MHz', sf: 'SF12', desc: 'Extreme attenuation detected.' }
    }
  }
]

const detailedAlerts = [
  { 
    id: 'BW-101', 
    type: 'Inactivity', 
    description: 'Unusual inactivity detected', 
    time: '2 mins ago', 
    severity: 'Medium', 
    needsAttention: true,
    icon: <Activity className="h-5 w-5" />,
    currentVal: '15 steps/min',
    threshold: '50 steps/min',
    location: 'North Pasture (Sector B)',
    duration: '45 mins'
  },
  { 
    id: 'BW-102', 
    type: 'Fever', 
    description: 'Fever detected (39.8C)', 
    time: '10 mins ago', 
    severity: 'High', 
    needsVet: true,
    icon: <Thermometer className="h-5 w-5" />,
    currentVal: '39.8°C',
    threshold: '39.2°C',
    location: 'Milking Bay 4',
    duration: '15 mins'
  },
  { 
    id: 'BW-103', 
    type: 'Healthy', 
    description: 'All vitals within normal range', 
    time: '25 mins ago', 
    severity: 'Low', 
    icon: <ShieldCheck className="h-5 w-5" />,
    currentVal: '38.4°C',
    threshold: '39.2°C',
    location: 'South Barn',
    duration: 'N/A'
  },
  { 
    id: 'BW-104', 
    type: 'CRITICAL', 
    description: 'In critical condition and need vet', 
    time: '1 min ago', 
    severity: 'Critical', 
    needsVet: true,
    icon: <ShieldAlert className="h-5 w-5" />,
    currentVal: '40.5°C',
    threshold: '39.5°C',
    location: 'Infirmary Wing',
    duration: '1 hour'
  },
  { 
    id: 'BW-105', 
    type: 'Geofence', 
    description: 'Approaching pasture boundary', 
    time: '45 mins ago', 
    severity: 'Medium', 
    icon: <MapPin className="h-5 w-5" />,
    currentVal: '5m from gate',
    threshold: '10m',
    location: 'East Perimeter Line',
    duration: '5 mins'
  },
]

export default function Dashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('snapshot')
  const [monitorType, setMonitorType] = useState('Cows')
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [liveActivity, setLiveActivity] = useState<any[]>([])
  const [staffList, setStaffList] = useState(staffListInitial)
  const [selectedCowId, setSelectedCowId] = useState('BW-452')
  const [kpiSelectedCowId, setKpiSelectedCowId] = useState('BW-452')
  const [selectedHardwareTagId, setSelectedHardwareTagId] = useState('Tag-001')
  const [pulsingTemps, setPulsingTemps] = useState<{ [key: string]: number }>({ 'BW-452': 39.8, 'BW-103': 38.4 })
  const [liveComparisonData, setLiveComparisonData] = useState<any[]>([])
  const [hardwareJitter, setHardwareJitter] = useState({ temp: 0, accel: 0, signal: 0, heart: 0 })
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<any>(null)
  const [highlightVet, setHighlightVet] = useState(false)

  const cowProfileImg = PlaceHolderImages.find(img => img.id === 'cow-profile');

  // Status and Color mapping
  const getCowHealthInfo = (id: string) => {
    if (id === 'BW-452') return { status: 'Critical', color: '#ef4444' }
    if (id === 'BW-103') return { status: 'Attention Required', color: '#f59e0b' }
    return { status: 'Stable', color: '#10b981' }
  }

  const selectedCowInfo = getCowHealthInfo(selectedCowId)

  // Live graph logic
  useEffect(() => {
    if (monitorType !== 'Cows') return;

    // Initial data generation
    setLiveActivity(Array.from({ length: 20 }, (_, i) => ({
      time: i,
      walking: 30 + Math.random() * 20,
      eating: 10 + Math.random() * 30,
      sleeping: 5 + Math.random() * 10
    })))

    const interval = setInterval(() => {
      // 1. Motion Feed Update
      setLiveActivity(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          walking: 30 + Math.random() * 20,
          eating: 10 + Math.random() * 30,
          sleeping: 5 + Math.random() * 10
        }]
        return newData
      })
      
      // 2. Priority Monitoring Pulses
      setPulsingTemps(prev => ({
        'BW-452': 39.5 + Math.random() * 0.6,
        'BW-103': 38.2 + Math.random() * 0.8
      }))

      // 3. Dynamic Comparison Data Update
      setLiveComparisonData(() => {
        return herdThermalData.map(item => {
          const deviation = selectedCowId === 'BW-452' ? 0.8 : (selectedCowId === 'BW-103' ? 0.4 : -0.1);
          return {
            ...item,
            cowTemp: item.avgTemp + (Math.random() * 0.4) + deviation
          }
        })
      })

      // 4. Hardware Jitter Update
      setHardwareJitter({
        temp: (Math.random() - 0.5) * 0.4,
        accel: (Math.random() - 0.5) * 0.1,
        signal: Math.floor((Math.random() - 0.5) * 2),
        heart: Math.floor((Math.random() - 0.5) * 4)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [selectedCowId, monitorType])

  // Sync initial comparison data
  useEffect(() => {
    setLiveComparisonData(herdThermalData.map(item => {
      const deviation = selectedCowId === 'BW-452' ? 0.8 : (selectedCowId === 'BW-103' ? 0.4 : -0.1);
      return {
        ...item,
        cowTemp: item.avgTemp + deviation
      }
    }))
  }, [selectedCowId])

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

  const openAlertDetails = (alert: any) => {
    setSelectedAlertForModal(alert)
    setIsAlertModalOpen(true)
  }

  const handleCallVetFromModal = () => {
    setIsAlertModalOpen(false)
    toast({
      title: "Emergency Redirect",
      description: "🔄 Switching to Staff & Emergency to initiate call...",
    })
    setActiveTab('staff')
    setHighlightVet(true)
    setTimeout(() => setHighlightVet(false), 3000)
  }

  const currentHardwareTag = hardwareTags.find(t => t.id === selectedHardwareTagId) || hardwareTags[0]
  const currentKpiCow = cowPerformanceData[kpiSelectedCowId]

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
          <div className="flex items-center gap-2 mr-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden md:block">Monitor:</span>
            <Select value={monitorType} onValueChange={setMonitorType}>
              <SelectTrigger className="w-[140px] md:w-[180px] bg-muted/50 border-white/10 h-9">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="Cows">Cows</SelectItem>
                <SelectItem value="Bulls">Bulls</SelectItem>
                <SelectItem value="Calves">Calves</SelectItem>
                <SelectItem value="Beef Cattle">Beef Cattle</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="bg-muted/50 p-1 inline-flex">
                <TabsTrigger value="snapshot">Herd Snapshot</TabsTrigger>
                <TabsTrigger value="alerts">Health Alerts</TabsTrigger>
                <TabsTrigger value="kpis">Vitality KPIs</TabsTrigger>
                <TabsTrigger value="thermal">Thermal Analysis</TabsTrigger>
                <TabsTrigger value="staff">Staff & Emergency</TabsTrigger>
                <TabsTrigger value="individual">Individual Cow</TabsTrigger>
                <TabsTrigger value="sensors">Hardware Inspector</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Tab 1: Snapshot */}
          <TabsContent value="snapshot" className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            {monitorType === 'Cows' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SnapshotCard title="Total Head" value="250" icon={<Users className="text-primary" />} trend="Registered Cows" />
                  <SnapshotCard title="Critical Alerts" value="05" icon={<AlertTriangle className="text-destructive" />} trend="Requires attention" color="text-destructive" />
                  <SnapshotCard title="In Heat" value="12" icon={<Activity className="text-secondary" />} trend="Sync tracking active" isHeat />
                  <SnapshotCard title="Health Score" value="94%" icon={<ShieldAlert className="text-primary" />} trend="Above industry avg" />
                  
                  <Card className="lg:col-span-3 glass-card flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Recent Alerts & System Health
                      </CardTitle>
                      <CardDescription>Live health feed merged with active sensor network status</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1">
                      <div className="space-y-3">
                        <AlertItem type="Fever" cow="BW-452" time="2 mins ago" severity="High" />
                        <AlertItem type="Geofence Exit" cow="BW-110" time="15 mins ago" severity="Medium" />
                        <AlertItem type="Low Rumination" cow="BW-098" time="1 hour ago" severity="Low" />
                      </div>

                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <Cpu className="h-3 w-3" />
                          Deployed Sensor Tech Stack
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <TechBadge icon={<Thermometer />} label="DS18B20 (Thermal)" />
                          <TechBadge icon={<Activity />} label="MPU6050 (Motion)" />
                          <TechBadge icon={<MapPin />} label="Neo-6M (GPS)" />
                          <TechBadge icon={<Zap />} label="PulseOx (SpO2)" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-1 glass-card p-6 flex flex-col justify-center text-center border-primary/20 bg-primary/5 min-h-[300px]">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-primary/20 rounded-full neon-border-emerald">
                        <CheckCircle className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold text-primary mb-1">18 Cows</h3>
                    <p className="text-lg font-bold text-foreground mb-1 uppercase tracking-tighter">Recovered / Cured</p>
                    <p className="text-sm text-muted-foreground leading-snug px-4">Successfully Treated after Early Detection via IoT Telemetry</p>
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <Badge variant="outline" className="text-primary border-primary/30">Verified</Badge>
                      <Badge variant="outline" className="text-primary border-primary/30">Healthy</Badge>
                    </div>
                  </Card>
                </div>
                <HealthLegend />
              </>
            ) : (
              <NoDataState type={monitorType} message={`No Data Available for ${monitorType}`} />
            )}
          </TabsContent>

          {/* Tab 2: Health Alerts */}
          <TabsContent value="alerts" className="space-y-4 animate-in slide-in-from-left-5 duration-300">
            {monitorType === 'Cows' ? (
              <>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Live Health Alerts</CardTitle>
                    <CardDescription>Real-time feed from all wearable sensors with detailed diagnostic data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {detailedAlerts.map((alert) => (
                      <div key={alert.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background/40 border border-white/5 rounded-lg gap-4 group">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl border transition-colors ${
                            alert.severity === 'Critical' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                            alert.type === 'Geofence' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                            alert.severity === 'Medium' || alert.needsAttention ? 'bg-secondary/10 border-secondary/20 text-secondary' :
                            alert.type === 'Healthy' ? 'bg-primary/10 border-primary/20 text-primary' :
                            'bg-muted border-white/5 text-muted-foreground'
                          }`}>
                            {alert.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold tracking-tight">Cow #{alert.id}</p>
                              <Badge variant={
                                alert.severity === 'Critical' ? 'destructive' : 
                                alert.type === 'Geofence' ? 'secondary' :
                                alert.severity === 'Medium' || alert.needsAttention ? 'secondary' :
                                'outline'
                              } className={`text-[10px] py-0 ${alert.type === 'Geofence' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : ''}`}>
                                {alert.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <div className="flex items-center gap-3">
                            {alert.needsAttention && (
                              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider animate-pulse">Attention Required</span>
                            )}
                            <p className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {alert.needsVet && (
                              <Button 
                                size="sm" 
                                variant="default" 
                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold gap-2"
                                onClick={() => {
                                  toast({
                                    title: "Emergency Redirect",
                                    description: "🔄 Switching to Staff & Emergency to initiate call...",
                                  })
                                  setActiveTab('staff')
                                  setHighlightVet(true)
                                  setTimeout(() => setHighlightVet(false), 3000)
                                }}
                              >
                                <Phone className="h-3 w-3" />
                                Call Vet
                              </Button>
                            )}
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="h-auto p-0 text-primary group-hover:underline"
                              onClick={() => openAlertDetails(alert)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <HealthLegend />
              </>
            ) : (
              <NoDataState type={monitorType} message={`No Active Alerts for ${monitorType}`} />
            )}
          </TabsContent>

          {/* Tab 3: Vitality KPIs */}
          <TabsContent value="kpis" className="space-y-6 animate-in slide-in-from-right-5 duration-300">
            {monitorType === 'Cows' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <KPICard title="Avg Body Temp" value="38.5°C" subtitle="Normal range" icon={<Thermometer className="text-primary" />} chartColor="hsl(var(--primary))" />
                  <KPICard title="Rumination Time" value="480m" subtitle="Avg / 24h" icon={<Activity className="text-secondary" />} chartColor="hsl(var(--secondary))" />
                  <KPICard title="Milk Yield" value="32.4L" subtitle="Avg / animal" icon={<Milk className="text-primary" />} chartColor="hsl(var(--primary))" />
                </div>

                <Card className="glass-card">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Individual Performance Drill-Down</CardTitle>
                      <CardDescription>Detailed telemetry analysis for specific livestock units</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Analyze Specific Cow:</span>
                      <Select value={kpiSelectedCowId} onValueChange={setKpiSelectedCowId}>
                        <SelectTrigger className="w-[180px] bg-background/50 border-white/10">
                          <SelectValue placeholder="Select Cow ID..." />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="BW-452">BW-452 (Critical)</SelectItem>
                          <SelectItem value="BW-103">BW-103 (Attention Req.)</SelectItem>
                          <SelectItem value="BW-007">BW-007 (Healthy)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500" key={kpiSelectedCowId}>
                      {/* Graph A: Temperature Deviation */}
                      <Card className="bg-muted/20 border-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Thermometer className="h-4 w-4" style={{ color: currentKpiCow.healthColor }} />
                            Temperature Deviation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentKpiCow.tempData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="time" hide />
                              <YAxis domain={[37, 41]} stroke="#ffffff30" fontSize={10} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                              />
                              <Line type="monotone" name="Cow Temp" dataKey="cowTemp" stroke={currentKpiCow.healthColor} strokeWidth={2.5} dot={false} isAnimationActive={true} />
                              <Line type="monotone" name="Herd Avg" dataKey="avgTemp" stroke="#ffffff30" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Graph B: Rumination Activity */}
                      <Card className="bg-muted/20 border-white/5">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Activity className="h-4 w-4" style={{ color: currentKpiCow.healthColor }} />
                            Rumination (5 Days)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={currentKpiCow.ruminationData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="day" stroke="#ffffff30" fontSize={10} />
                              <YAxis stroke="#ffffff30" fontSize={10} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                              />
                              <ReferenceLine y={450} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'Target', fill: '#10b981', fontSize: 10 }} />
                              <Bar 
                                dataKey="mins" 
                                radius={[4, 4, 0, 0]}
                                fill={currentKpiCow.healthColor}
                                isAnimationActive={true}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Graph C: Milk Yield Consistency */}
                      <Card className="bg-muted/20 border-white/5">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                              <Milk className="h-4 w-4" style={{ color: currentKpiCow.healthColor }} />
                              Milk Yield (7 Days)
                            </CardTitle>
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                              {currentKpiCow.trend === 'Improving' && <TrendingUp className="h-3 w-3 text-primary" />}
                              {currentKpiCow.trend === 'Declining' && <TrendingDown className="h-3 w-3 text-destructive" />}
                              {currentKpiCow.trend === 'Stable' && <Minus className="h-3 w-3 text-secondary" />}
                              <span className={
                                currentKpiCow.trend === 'Improving' ? 'text-primary' : 
                                (currentKpiCow.trend === 'Declining' ? 'text-destructive' : 'text-secondary')
                              }>{currentKpiCow.trend}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentKpiCow.milkData}>
                              <defs>
                                <linearGradient id={`milkGradient-${kpiSelectedCowId}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={currentKpiCow.healthColor} stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor={currentKpiCow.healthColor} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                              <XAxis dataKey="day" hide />
                              <YAxis stroke="#ffffff30" fontSize={10} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                              />
                              <Area type="monotone" dataKey="yield" stroke={currentKpiCow.healthColor} strokeWidth={2.5} fillOpacity={1} fill={`url(#milkGradient-${kpiSelectedCowId})`} isAnimationActive={true} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <NoDataState type={monitorType} message={`No Vitality Data for ${monitorType}`} />
            )}
          </TabsContent>

          {/* Tab 4: Thermal Analysis */}
          <TabsContent value="thermal" className="space-y-6 animate-in fade-in duration-500">
            {monitorType === 'Cows' ? (
              <>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-primary" />
                      Herd Average Temperature (24h)
                    </CardTitle>
                    <CardDescription>
                      Smooth aggregate tracking across the entire herd population
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={herdThermalData}>
                          <defs>
                            <linearGradient id="herdTempGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="time" stroke="#ffffff50" fontSize={10} />
                          <YAxis domain={[37, 40]} stroke="#ffffff50" fontSize={10} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: 'hsl(var(--primary))' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="avgTemp" 
                            stroke="hsl(var(--destructive))" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#herdTempGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-white/5">
                      <Info className="h-4 w-4 text-primary" />
                      <p className="text-xs text-muted-foreground italic">
                        Data represents the aggregated average of 250 active sensors. Anomalies are smoothed out.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
                      <Zap className="h-4 w-4 text-primary" />
                      Priority Monitoring
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FavoriteCowCard 
                        id="BW-452" 
                        temp={pulsingTemps['BW-452']} 
                        status="Critical" 
                        isActive={selectedCowId === 'BW-452'}
                        onClick={() => setSelectedCowId('BW-452')}
                      />
                      <FavoriteCowCard 
                        id="BW-103" 
                        temp={pulsingTemps['BW-103']} 
                        status="Attention Required" 
                        isActive={selectedCowId === 'BW-103'}
                        onClick={() => setSelectedCowId('BW-103')}
                      />
                    </div>

                    <Card className="glass-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                          <SearchCode className="h-4 w-4 text-secondary" />
                          Specific Cattle Inspector
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Select Cow ID</p>
                          <Select value={selectedCowId} onValueChange={setSelectedCowId}>
                            <SelectTrigger className="bg-background/50 border-white/10">
                              <SelectValue placeholder="Search Cow ID..." />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10">
                              <SelectItem value="BW-452">BW-452 (Critical)</SelectItem>
                              <SelectItem value="BW-103">BW-103 (Attention Req.)</SelectItem>
                              <SelectItem value="BW-089">BW-089 (Stable)</SelectItem>
                              <SelectItem value="BW-007">BW-007 (Stable)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                          <p className="text-[10px] font-bold text-secondary flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            INVESTIGATOR LOG
                          </p>
                          <p className="text-xs mt-1 leading-snug">
                            Currently analyzing telemetry for <span className="text-primary font-bold">#{selectedCowId}</span>. 
                            Status: <span style={{ color: selectedCowInfo.color }} className="font-bold">{selectedCowInfo.status}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="lg:col-span-2 glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Deviation Analysis</CardTitle>
                          <CardDescription>Individual Cow #{selectedCowId} vs Herd Average</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary">Live Comparison</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={liveComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="time" stroke="#ffffff30" fontSize={10} />
                            <YAxis domain={[37, 41]} stroke="#ffffff30" fontSize={10} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            />
                            <Legend iconType="circle" />
                            <Line 
                              type="monotone" 
                              name={`Cow #${selectedCowId} Temp`} 
                              dataKey="cowTemp" 
                              stroke={selectedCowInfo.color} 
                              strokeWidth={3} 
                              dot={{ r: 4, fill: selectedCowInfo.color }} 
                              activeDot={{ r: 6 }}
                              isAnimationActive={true}
                              animationDuration={500}
                            />
                            <Line 
                              type="monotone" 
                              name="Herd Baseline" 
                              dataKey="avgTemp" 
                              stroke="#ffffff30" 
                              strokeWidth={2} 
                              strokeDasharray="5 5" 
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <HealthLegend />
              </>
            ) : (
              <NoDataState type={monitorType} message={`No Thermal Data for ${monitorType}`} />
            )}
          </TabsContent>

          {/* Tab 5: Staff */}
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
                <Card 
                  key={staff.id} 
                  className={`glass-card overflow-hidden group transition-all duration-500 ${
                    highlightVet && staff.role === 'Veterinarian' ? 'ring-2 ring-destructive animate-pulse bg-destructive/10' : ''
                  }`}
                >
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
                    <Button 
                      variant={highlightVet && staff.role === 'Veterinarian' ? 'destructive' : 'ghost'} 
                      size="sm" 
                      className={`${highlightVet && staff.role === 'Veterinarian' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                    >
                      Contact
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab 6: Individual Health */}
          <TabsContent value="individual" className="space-y-6">
            {monitorType === 'Cows' ? (
              <>
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
                            data-ai-hint={cowProfileImg?.imageHint || 'cow face'}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">Cow #BW-452</CardTitle>
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 uppercase tracking-tight">Cattle Health 360 Tag</Badge>
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
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#1e3a8a' }} /> 
                          <span className="text-xs font-medium">Walking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#eab308' }} /> 
                          <span className="text-xs font-medium">Eating</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-white" /> 
                          <span className="text-xs font-medium">Sleeping</span>
                        </div>
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
                          <Line type="monotone" name="Walking" dataKey="walking" stroke="#1e3a8a" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                          <Line type="monotone" name="Eating" dataKey="eating" stroke="#eab308" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                          <Line type="monotone" name="Sleeping" dataKey="sleeping" stroke="#ffffff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
                <HealthLegend />
              </>
            ) : (
              <NoDataState type={monitorType} message={`No Profile Data for ${monitorType}`} />
            )}
          </TabsContent>

          {/* Tab 7: Hardware Inspector (LIVE UPDATE) */}
          <TabsContent value="sensors" className="space-y-6 animate-in fade-in duration-500">
            {monitorType === 'Cows' ? (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider">Device Hardware Selector</h3>
                      <p className="text-xs text-muted-foreground">Select a specific tag to inspect module telemetry</p>
                    </div>
                  </div>
                  <Select value={selectedHardwareTagId} onValueChange={setSelectedHardwareTagId}>
                    <SelectTrigger className="w-[250px] bg-background/50 border-white/10">
                      <SelectValue placeholder="Select device..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {hardwareTags.map(tag => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.id} ({tag.cow} - {tag.scenario})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Device Profile */}
                  <Card className={`lg:col-span-1 border-white/10 shadow-2xl relative overflow-hidden group transition-colors duration-500 ${
                    currentHardwareTag.battery < 20 ? 'bg-destructive/10 border-destructive/20' : 'bg-slate-900/80'
                  }`}>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Cpu className="h-48 w-48 text-white rotate-12" />
                    </div>
                    <CardHeader className="relative z-10 pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/20 rounded-md">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${
                          currentHardwareTag.battery < 20 ? 'border-destructive/30 text-destructive' : 'border-primary/30 text-primary'
                        }`}>
                          {currentHardwareTag.scenario}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-bold tracking-tight text-white font-headline">Smart Collar Tag (Pro)</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-6">
                      <div className="space-y-4 pt-4">
                        <HardwareStat label="Model Name" value="CH-360-X1" />
                        <HardwareStat label="Hardware Assigned" value={`${currentHardwareTag.cow} (${currentHardwareTag.type})`} valueClass="text-primary" />
                        <HardwareStat label="Firmware Version" value="v2.4.1 (Stable)" isMono />
                        <HardwareStat 
                          label="Power Source" 
                          value={`3.7V LiPo (${currentHardwareTag.battery}%)`} 
                          icon={<Battery className={`h-3 w-3 ${currentHardwareTag.battery < 20 ? 'text-destructive animate-pulse' : 'text-primary'}`} />} 
                        />
                        <HardwareStat label="Last Calibration" value={currentHardwareTag.lastCalib} />
                        <HardwareStat 
                          label="Gateway Connection" 
                          value={`Signal: ${currentHardwareTag.signal + (currentHardwareTag.id === 'Tag-003' ? 0 : hardwareJitter.signal)} dBm`} 
                          valueClass={currentHardwareTag.signal < -80 ? 'text-destructive font-bold' : 'text-secondary font-bold'} 
                        />
                      </div>
                      
                      <div className="p-4 bg-background/40 rounded-lg border border-white/5 mt-6">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase mb-3 tracking-widest">Antenna Integrity</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span>LoRa Uplink</span>
                            <span className={currentHardwareTag.signal < -80 ? 'text-destructive' : 'text-primary'}>
                              {currentHardwareTag.signal < -80 ? '42%' : '98%'}
                            </span>
                          </div>
                          <Progress 
                            value={currentHardwareTag.signal < -80 ? 42 : 98} 
                            className={`h-1 bg-white/5`} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right Column: Module Grid */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Active Sensor Modules</h3>
                      <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-mono text-[10px]">4 Modules Detected</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SensorModuleCard 
                        name={currentHardwareTag.modules.accel.name}
                        status={currentHardwareTag.modules.accel.status}
                        statusType={currentHardwareTag.modules.accel.statusType}
                        description={currentHardwareTag.modules.accel.desc}
                        readout={currentHardwareTag.modules.accel.statusType === 'destructive' && currentHardwareTag.modules.accel.status !== 'Low Power' ? 'AXIS_LOCKED' : (
                          currentHardwareTag.modules.accel.isCalib ? '---' : 
                          `X:${(currentHardwareTag.modules.accel.x + hardwareJitter.accel).toFixed(2)} Y:${(currentHardwareTag.modules.accel.y + hardwareJitter.accel).toFixed(2)} Z:${(currentHardwareTag.modules.accel.z + hardwareJitter.accel).toFixed(2)}`
                        )}
                        health={currentHardwareTag.modules.accel.health}
                        icon={<Activity className="h-4 w-4" />}
                        isBlinking={currentHardwareTag.modules.accel.isCalib}
                      />
                      <SensorModuleCard 
                        name={currentHardwareTag.modules.thermal.name}
                        status={currentHardwareTag.modules.thermal.status}
                        statusType={currentHardwareTag.modules.thermal.statusType}
                        description={currentHardwareTag.modules.thermal.desc}
                        readout={currentHardwareTag.modules.thermal.isCalib ? '---' : `${(currentHardwareTag.modules.thermal.val + hardwareJitter.temp).toFixed(1)}°C`}
                        health={currentHardwareTag.modules.thermal.health}
                        icon={<Thermometer className="h-4 w-4" />}
                        isBlinking={currentHardwareTag.modules.thermal.isCalib}
                      />
                      <SensorModuleCard 
                        name={currentHardwareTag.modules.heart.name}
                        status={currentHardwareTag.modules.heart.status}
                        statusType={currentHardwareTag.modules.heart.statusType}
                        description={currentHardwareTag.modules.heart.desc}
                        readout={currentHardwareTag.modules.heart.status === 'Disabled' ? '-- BPM' : (currentHardwareTag.modules.heart.isCalib ? '---' : `${currentHardwareTag.modules.heart.val + hardwareJitter.heart} BPM`)}
                        health={currentHardwareTag.modules.heart.health}
                        isBlinking={currentHardwareTag.modules.heart.statusType === 'warning' || currentHardwareTag.modules.heart.status === 'Disabled'}
                        icon={<Zap className="h-4 w-4" />}
                      />
                      <SensorModuleCard 
                        name={currentHardwareTag.modules.lora.name}
                        status={currentHardwareTag.modules.lora.status}
                        statusType={currentHardwareTag.modules.lora.statusType}
                        description={currentHardwareTag.modules.lora.desc}
                        readout={currentHardwareTag.modules.lora.isCalib ? '---' : `${currentHardwareTag.modules.lora.sf} / ${currentHardwareTag.modules.lora.freq}`}
                        health={currentHardwareTag.modules.lora.health}
                        icon={<Radio className="h-4 w-4" />}
                        isBlinking={currentHardwareTag.modules.lora.status === 'Weak Signal'}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <NoDataState type={monitorType} message={`No Active Sensors paired with ${monitorType}`} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isAlertModalOpen} onOpenChange={setIsAlertModalOpen}>
        <DialogContent className="glass-modal border-white/10 sm:max-w-[500px]">
          {selectedAlertForModal && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    selectedAlertForModal.severity === 'Critical' ? 'bg-destructive/20 text-destructive' :
                    selectedAlertForModal.type === 'Geofence' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-secondary/20 text-secondary'
                  }`}>
                    {selectedAlertForModal.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                      {selectedAlertForModal.type.toUpperCase()} DETECTED
                      <Badge variant="outline" className="text-[10px]">{selectedAlertForModal.severity}</Badge>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Investigation Report for Cow #{selectedAlertForModal.id}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Value</p>
                    <p className="text-2xl font-bold text-foreground">{selectedAlertForModal.currentVal}</p>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Alert Threshold</p>
                    <p className="text-2xl font-bold text-muted-foreground">{selectedAlertForModal.threshold}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Tracked Location</p>
                      <p className="font-medium">{selectedAlertForModal.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="p-2 bg-secondary/10 rounded-full">
                      <Clock className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Duration</p>
                      <p className="font-medium">{selectedAlertForModal.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Automated diagnosis suggests monitoring vitals over the next hour. If values remain above threshold, immediate veterinary intervention is required.
                  </p>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => setIsAlertModalOpen(false)} className="flex-1">
                  Dismiss Alert
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                  onClick={handleCallVetFromModal}
                >
                  Call Vet / Notify
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AIChat />

      <footer className="p-4 border-t border-white/10 text-center text-muted-foreground text-[10px] bg-card/20 backdrop-blur-sm">
        ⚠️ Prototype v1.0 • For Demonstration Purposes Only • Cattle Health 360 AI Engine v2.5
      </footer>
    </div>
  );
}

// Subcomponents
function NoDataState({ type, message }: { type: string, message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-white/10 rounded-xl bg-card/20 animate-in fade-in duration-500">
      <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
      <h3 className="text-xl font-bold text-muted-foreground">{message}</h3>
      <p className="text-sm text-muted-foreground/60">Please switch to 'Cows' to view active demo data.</p>
    </div>
  )
}

function HealthLegend() {
  return (
    <div className="flex justify-center w-full">
      <Card className="glass-modal p-4 border-l-4 border-l-primary inline-block">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-primary" /> Healthy / Normal</div>
          <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-destructive" /> Critical Alert</div>
          <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Geofence Alert</div>
          <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-secondary" /> Attention Required</div>
        </div>
      </Card>
    </div>
  )
}

function SnapshotCard({ title, value, icon, trend, color = "text-primary", isHeat = false }: any) {
  const finalColor = isHeat ? 'text-secondary' : color;

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className={`p-2 rounded-lg ${isHeat ? 'bg-secondary/20' : 'bg-muted/50'}`}>{icon}</div>
        </div>
        <h3 className={`text-3xl font-bold font-headline mb-1 ${finalColor}`}>{value}</h3>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          {trend}
        </p>
      </CardContent>
    </Card>
  )
}

function TechBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1 bg-background/50 rounded-full border border-white/5 hover:border-primary/30 transition-colors">
      <div className="text-primary child-svg-h-3 child-svg-w-3 [&_svg]:h-3 [&_svg]:w-3">
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  )
}

function KPICard({ title, value, subtitle, icon, chartColor }: any) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    setChartData(Array.from({length: 12}, () => ({v: 5 + Math.random() * 5})))

    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1), { v: 5 + Math.random() * 5 }]
        return newData
      })
    }, 2000)

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

function AlertItem({ type, cow, time, severity }: any) {
  const isGeofence = type.includes('Geofence') || type === 'Geofence Exit';
  
  const severityColor = {
    High: 'text-destructive border-destructive/20 bg-destructive/5',
    Medium: 'text-secondary border-secondary/20 bg-secondary/5',
    Low: 'text-primary border-primary/20 bg-primary/5'
  }[severity as 'High'|'Medium'|'Low']

  const finalSeverityColor = isGeofence ? 'text-orange-400 border-orange-400/20 bg-orange-400/5' : severityColor;

  return (
    <div className={`p-3 border rounded-lg flex items-center justify-between ${finalSeverityColor}`}>
      <div className="flex items-center gap-3">
        {isGeofence ? <MapPin className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
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

function FavoriteCowCard({ id, temp, status, isActive, onClick }: { id: string, temp: number, status: string, isActive: boolean, onClick: () => void }) {
  const colorClass = status === 'Critical' ? 'text-destructive' : (status === 'Attention Required' ? 'text-secondary' : 'text-primary')
  
  return (
    <Card 
      className={`p-3 glass-card cursor-pointer transition-all border-2 ${isActive ? 'border-primary bg-primary/10' : 'border-white/5 hover:border-primary/50'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <p className="text-[10px] font-bold text-muted-foreground">COW #{id}</p>
        <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-bold ${status === 'Critical' ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
          {temp?.toFixed(1) || '--'}°C
        </span>
      </div>
      <p className={`text-[9px] font-bold uppercase ${colorClass}`}>
        {status}
      </p>
    </Card>
  )
}

function HardwareStat({ label, value, isMono, icon, valueClass }: any) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/5">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        {icon}
        <span className={`text-xs font-bold ${isMono ? 'font-mono' : ''} ${valueClass || 'text-white'}`}>{value}</span>
      </div>
    </div>
  )
}

function SensorModuleCard({ name, status, statusType, description, readout, health, icon, isBlinking }: any) {
  const bgTints = {
    success: 'bg-emerald-500/5 border-emerald-500/20',
    warning: 'bg-amber-500/10 border-amber-500/20',
    info: 'bg-secondary/10 border-secondary/20',
    destructive: 'bg-destructive/10 border-destructive/20'
  }

  const pulseColors = {
    success: 'bg-primary',
    warning: 'bg-amber-500',
    info: 'bg-secondary',
    destructive: 'bg-destructive'
  }

  return (
    <Card className={`border hover:border-white/30 transition-all p-4 space-y-4 duration-500 ${bgTints[statusType as keyof typeof bgTints] || 'bg-[#0f172a] border-white/10'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/5 rounded-md text-white/70">
            {icon}
          </div>
          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${pulseColors[statusType as keyof typeof pulseColors]} ${isBlinking || statusType === 'success' ? 'animate-pulse' : ''}`} />
          <span className={`text-[9px] font-bold uppercase tracking-widest ${
            statusType === 'warning' ? 'text-amber-500' : 
            (statusType === 'info' ? 'text-secondary' : 
            (statusType === 'destructive' ? 'text-destructive' : 'text-primary'))
          }`}>
            {status}
          </span>
        </div>
      </div>
      
      <div>
        <p className="text-[10px] text-muted-foreground leading-snug">{description}</p>
        <div className={`mt-3 py-2 px-3 rounded border border-white/5 flex items-center justify-center transition-colors ${
          isBlinking ? 'bg-black/60 border-primary/20 animate-pulse' : 'bg-black/40'
        }`}>
          <span className={`font-mono text-xs font-bold tracking-widest ${
             statusType === 'destructive' ? 'text-destructive' : 'text-primary/90'
          }`}>{readout}</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[9px] text-muted-foreground">
          <span>MODULE INTEGRITY</span>
          <span className="font-bold">{health}%</span>
        </div>
        <Progress value={health} className="h-1 bg-white/5" />
      </div>
    </Card>
  )
}
