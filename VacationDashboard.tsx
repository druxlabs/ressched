import React, { useMemo, useState } from 'react';
import { VacationRequest, VacationStatus } from '../types';
import { Search, CheckCircle2, Clock, XCircle, Calendar, Plane, AlertTriangle, Briefcase } from 'lucide-react';

interface VacationDashboardProps {
  requests: VacationRequest[];
}

export const VacationDashboard: React.FC<VacationDashboardProps> = ({ requests }) => {
  const [filterStatus, setFilterStatus] = useState<VacationStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'Requested').length,
      approved: requests.filter(r => r.status === 'Approved').length,
      rejected: requests.filter(r => r.status === 'Rejected').length
    };
  }, [requests]);

  // Filter and Sort Logic
  const filteredRequests = useMemo(() => {
    return requests
      .filter(r => filterStatus === 'All' || r.status === filterStatus)
      .filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime()); // Chronological order
  }, [requests, filterStatus, searchTerm]);

  // Group by Month Year
  const groupedRequests = useMemo(() => {
    const groups: Record<string, VacationRequest[]> = {};
    filteredRequests.forEach(req => {
      const key = req.startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(req);
    });
    return groups;
  }, [filteredRequests]);

  const StatCard = ({ title, count, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <StatCard 
                title="Total Requests" 
                count={stats.total} 
                icon={Briefcase} 
                bgClass="bg-slate-100" 
                colorClass="text-slate-600" 
             />
             <StatCard 
                title="Pending" 
                count={stats.pending} 
                icon={Clock} 
                bgClass="bg-amber-50" 
                colorClass="text-amber-600" 
             />
             <StatCard 
                title="Approved" 
                count={stats.approved} 
                icon={CheckCircle2} 
                bgClass="bg-emerald-50" 
                colorClass="text-emerald-600" 
             />
             <StatCard 
                title="Rejected" 
                count={stats.rejected} 
                icon={XCircle} 
                bgClass="bg-red-50" 
                colorClass="text-red-600" 
             />
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-10">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search resident or leave type..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {['All', 'Requested', 'Approved', 'Rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                            filterStatus === status 
                            ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>

        {/* Grouped Requests List */}
        <div className="space-y-8 pb-12">
            {Object.keys(groupedRequests).length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="bg-slate-50 p-4 rounded-full inline-flex mb-4">
                        <Plane className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No requests found</h3>
                    <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                Object.entries(groupedRequests).map(([month, reqs]: [string, VacationRequest[]]) => (
                    <div key={month} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-slate-400"/>
                                {month}
                            </h3>
                            <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                                {reqs.length} {reqs.length === 1 ? 'Request' : 'Requests'}
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {reqs.map(req => (
                                <div key={req.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 p-2.5 rounded-xl shrink-0 border ${
                                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            req.status === 'Requested' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {req.status === 'Approved' ? <CheckCircle2 size={20} /> :
                                             req.status === 'Requested' ? <Clock size={20} /> :
                                             <XCircle size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-usf-green transition-colors">{req.name}</h4>
                                            <div className="flex flex-wrap items-center text-sm text-slate-500 mt-1 gap-y-1">
                                                <span className="font-semibold text-slate-700 mr-2 bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide">{req.type}</span>
                                                <span className="hidden sm:inline text-slate-300 mr-2">•</span>
                                                <div className="flex items-center">
                                                    <span className="font-medium">
                                                        {req.startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span className="mx-1.5 text-slate-400">→</span>
                                                    <span className="font-medium">
                                                        {req.endDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between md:justify-end gap-4 pl-16 md:pl-0">
                                         {/* Status Badge */}
                                         <div className="flex flex-col items-end">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                                                req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                                req.status === 'Requested' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                'bg-red-100 text-red-800 border-red-200'
                                            }`}>
                                                {req.status}
                                            </span>
                                            {req.status === 'Requested' && (
                                                <span className="text-[10px] text-slate-400 mt-1 font-medium flex items-center">
                                                    <AlertTriangle size={10} className="mr-1" />
                                                    Pending Review
                                                </span>
                                            )}
                                         </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};