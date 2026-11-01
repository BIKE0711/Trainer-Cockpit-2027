const { useState, useMemo } = React;

// --- ICON COMPONENTS ---
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    calendar: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 2 0 0 1 2 2v14a2 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
    users: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    clock: <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />,
    briefcase: <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />,
    backpack: <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />,
    plus: <path d="M12 5v14M5 12h14" />,
    trash: <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
    arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
    arrowDown: <path d="M12 5v14M5 12l7 7 7-7" />,
    check: <path d="M20 6L9 17l-5-5" />,
    layers: <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />,
    settings: <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || null}
    </svg>
  );
};

// --- INITIAL METHOD DATABASE ---
const INITIAL_METHODS = [
  { id: 'm1', name: 'Check-in & Erwartungsabfrage', type: 'both', duration: 30, minGroup: 2, maxGroup: 25, hierarchy: 'all', materials: ['Post-its', 'Stifte', 'Flipchart'], desc: 'Klassischer Einstieg zur Ausrichtung der Gruppe.' },
  { id: 'm2', name: 'Theoretischer Impuls & Input', type: 'training', duration: 45, minGroup: 5, maxGroup: 30, hierarchy: 'all', materials: ['Beamer', 'Handouts'], desc: 'Fokussierter Wissensinput durch den Trainer.' },
  { id: 'm3', name: 'Kleingruppen-Reflection', type: 'both', duration: 60, minGroup: 4, maxGroup: 16, hierarchy: 'all', materials: ['Moderationskarten', 'Marker'], desc: 'Deep-dive Diskussion in Subgruppen.' },
  { id: 'm4', name: 'Kollegiale Fallberatung', type: 'coaching', duration: 90, minGroup: 3, maxGroup: 10, hierarchy: 'peers', materials: ['Timer', 'A3 Bögen'], desc: 'Strukturiertes Coaching-Format für konkrete Praxisfälle.' },
  { id: 'm5', name: 'Rollenspiel & Simulation', type: 'training', duration: 60, minGroup: 4, maxGroup: 12, hierarchy: 'non-exec', materials: ['Szenario-Karten', 'Feedback-Bögen'], desc: 'Praktisches Einüben von Gesprächssituationen.' },
  { id: 'm6', name: 'Systemische Aufstellung / Soziogramm', type: 'coaching', duration: 75, minGroup: 3, maxGroup: 12, hierarchy: 'all', materials: ['Bodenseile / Marker'], desc: 'Muster und Dynamiken im Raum sichtbar machen.' },
  { id: 'm7', name: 'Action Planning & Transfer', type: 'both', duration: 45, minGroup: 1, maxGroup: 30, hierarchy: 'all', materials: ['Action-Canvas', 'Stifte'], desc: 'Sicherung der Praxistransfers für den Alltag.' }
];

function App() {
  const [activeTab, setActiveTab] = useState('planner');
  
  // Filter Inputs
  const [days, setDays] = useState(1);
  const [groupSize, setGroupSize] = useState(8);
  const [format, setFormat] = useState('mix');
  const [hierarchy, setHierarchy] = useState('peers');
  const [isMultiTerm, setIsMultiTerm] = useState(false);

  // Method Database
  const [methods, setMethods] = useState(INITIAL_METHODS);

  // Active Schedule State
  const [schedule, setSchedule] = useState([
    { id: 'p1', time: '09:00 - 09:30', name: 'Ankommen & Kaffeeempfang', type: 'break', duration: 30, fixed: true },
    { id: 'p2', time: '09:30 - 10:00', name: 'Check-in & Erwartungsabfrage', type: 'both', duration: 30, materials: ['Post-its', 'Stifte', 'Flipchart'] },
    { id: 'p3', time: '10:00 - 10:45', name: 'Theoretischer Impuls & Input', type: 'training', duration: 45, materials: ['Beamer', 'Handouts'] },
    { id: 'p4', time: '10:45 - 11:00', name: 'Kaffeepause', type: 'break', duration: 15, fixed: true },
    { id: 'p5', time: '11:00 - 12:30', name: 'Kollegiale Fallberatung', type: 'coaching', duration: 90, materials: ['Timer', 'A3 Bögen'] },
    { id: 'p6', time: '12:30 - 13:30', name: 'Mittagspause', type: 'break', duration: 60, fixed: true },
    { id: 'p7', time: '13:30 - 15:00', name: 'Kleingruppen-Reflection', type: 'both', duration: 90, materials: ['Moderationskarten', 'Marker'] },
    { id: 'p8', time: '15:00 - 15:15', name: 'Nachmittagspause', type: 'break', duration: 15, fixed: true },
    { id: 'p9', time: '15:15 - 16:30', name: 'Action Planning & Transfer', type: 'both', duration: 75, materials: ['Action-Canvas', 'Stifte'] },
    { id: 'p10', time: '16:30 - 17:00', name: 'Abschluss-Check-out', type: 'both', duration: 30, materials: ['Post-its'] }
  ]);

  const [newMethod, setNewMethod] = useState({
    name: '', type: 'training', duration: 45, minGroup: 2, maxGroup: 20, materials: '', desc: ''
  });

  const reindexScheduleTimes = (blocks) => {
    let currentMinutes = 9 * 60;
    return blocks.map(block => {
      const startH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
      const startM = (currentMinutes % 60).toString().padStart(2, '0');
      
      currentMinutes += block.duration;
      
      const endH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
      const endM = (currentMinutes % 60).toString().padStart(2, '0');

      return {
        ...block,
        time: `${startH}:${startM} - ${endH}:${endM}`
      };
    });
  };

  const moveBlock = (index, direction) => {
    const newSched = [...schedule];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSched.length) return;
    
    const temp = newSched[index];
    newSched[index] = newSched[targetIndex];
    newSched[targetIndex] = temp;

    setSchedule(reindexScheduleTimes(newSched));
  };

  const addMethodToSchedule = (method) => {
    const newBlock = {
      id: 'sched_' + Date.now(),
      name: method.name,
      type: method.type,
      duration: method.duration,
      materials: method.materials || []
    };
    setSchedule(reindexScheduleTimes([...schedule, newBlock]));
  };

  const removeBlock = (index) => {
    const updated = schedule.filter((_, i) => i !== index);
    setSchedule(reindexScheduleTimes(updated));
  };

  const backpackItems = useMemo(() => {
    const itemsMap = {};
    schedule.forEach(block => {
      if (block.materials) {
        block.materials.forEach(mat => {
          let qty = 1;
          if (['Post-its', 'Stifte', 'Handouts', 'Action-Canvas', 'A3 Bögen'].includes(mat)) {
            qty = groupSize;
          }
          itemsMap[mat] = (itemsMap[mat] || 0) + qty;
        });
      }
    });
    return Object.entries(itemsMap).map(([name, qty]) => ({ name, qty }));
  }, [schedule, groupSize]);

  const handleCreateMethod = (e) => {
    e.preventDefault();
    if (!newMethod.name) return;
    const created = {
      ...newMethod,
      id: 'm_' + Date.now(),
      materials: newMethod.materials.split(',').map(m => m.trim()).filter(Boolean)
    };
    setMethods([...methods, created]);
    setNewMethod({ name: '', type: 'training', duration: 45, minGroup: 2, maxGroup: 20, materials: '', desc: '' });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* HEADER WITH BRAND COLOR #0053a0 */}
      <header className="bg-[#0053a0] text-white px-6 py-4 shadow-md flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-[#a7e600] p-2 rounded-lg text-slate-900 shadow">
            <Icon name="layers" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wide text-white">TRAINER COCKPIT</h1>
            <p className="text-xs text-blue-100">Auftragsklärung & Flexible Fahrplan-Generierung</p>
          </div>
        </div>

        {/* TABS */}
        <nav className="flex bg-[#003d75] p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('planner')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'planner' ? 'bg-[#a7e600] text-slate-900 shadow' : 'text-blue-100 hover:text-white'}`}>
            <Icon name="calendar" className="w-4 h-4" />
            <span>Fahrplan-Editor</span>
          </button>
          <button 
            onClick={() => setActiveTab('backpack')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'backpack' ? 'bg-[#a7e600] text-slate-900 shadow' : 'text-blue-100 hover:text-white'}`}>
            <Icon name="backpack" className="w-4 h-4" />
            <span>Digital Backpack ({backpackItems.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('backend')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'backend' ? 'bg-[#a7e600] text-slate-900 shadow' : 'text-blue-100 hover:text-white'}`}>
            <Icon name="settings" className="w-4 h-4" />
            <span>Methoden-Backend</span>
          </button>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* SIDEBAR FILTER */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-5">
                <h2 className="text-lg font-bold flex items-center gap-2 text-[#0053a0]">
                  <Icon name="settings" className="w-5 h-5 text-[#a7e600]" />
                  Kunden-Parameter Filter
                </h2>

                {/* Dauer */}
                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-slate-600">Dauer (Tage):</span>
                    <span className="font-bold text-[#0053a0]">{days} Tag(e)</span>
                  </div>
                  <input 
                    type="range" min="1" max="10" value={days} 
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full accent-[#0053a0] cursor-pointer"
                  />
                </div>

                {/* Gruppengröße */}
                <div>
                  <div className="flex justify-between text-sm mb-1 font-medium">
                    <span className="text-slate-600">Teilnehmeranzahl:</span>
                    <span className="font-bold text-[#0053a0]">{groupSize} Personen</span>
                  </div>
                  <input 
                    type="range" min="2" max="35" value={groupSize} 
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="w-full accent-[#0053a0] cursor-pointer"
                  />
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Format-Ausrichtung:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['training', 'mix', 'coaching'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`py-2 px-1 text-xs rounded-lg font-bold capitalize border transition ${format === f ? 'bg-[#0053a0] text-white border-[#0053a0]' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                        {f === 'mix' ? 'Mischform' : f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hierarchie */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Zielgruppe / Hierarchie:</label>
                  <select 
                    value={hierarchy} onChange={(e) => setHierarchy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 font-medium focus:outline-none focus:border-[#0053a0]">
                    <option value="peers">Gleiche Hierarchieebene (Peers)</option>
                    <option value="mixed">Hierarchieübergreifend (Gemischt)</option>
                    <option value="execs">Führungskräfte / C-Level</option>
                  </select>
                </div>

                {/* Mehrfachtermine */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-600">Mehrfachtermine / Modul-Reihe:</span>
                  <input 
                    type="checkbox" checked={isMultiTerm} 
                    onChange={(e) => setIsMultiTerm(e.target.checked)}
                    className="w-5 h-5 accent-[#0053a0] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* METHODEN BIBLIOTHEK */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passende Bausteine ({methods.length})</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {methods.map(m => (
                    <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center hover:border-[#0053a0] transition">
                      <div>
                        <div className="font-bold text-sm text-slate-800">{m.name}</div>
                        <div className="text-xs text-slate-500">{m.duration} Min | Typ: {m.type}</div>
                      </div>
                      <button 
                        onClick={() => addMethodToSchedule(m)}
                        className="p-1.5 bg-[#a7e600] hover:bg-[#95cd00] text-slate-900 rounded-lg transition shadow-sm font-bold"
                        title="Zu Fahrplan hinzufügen">
                        <Icon name="plus" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAHRPLAN / TIMELINE */}
            <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0053a0] flex items-center gap-2">
                    <Icon name="clock" className="w-6 h-6 text-[#0053a0]" />
                    Interaktiver Fahrplan (Tag 1 von {days})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Festes Schema 09:00 - 17:00 Uhr inkl. Pausen-Taktung</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium">Bausteine:</span>
                  <div className="text-lg font-black text-[#0053a0]">{schedule.length}</div>
                </div>
              </div>

              {/* TIMELINE SLOTS */}
              <div className="space-y-3">
                {schedule.map((block, index) => (
                  <div 
                    key={block.id || index} 
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition ${
                      block.type === 'break' 
                        ? 'bg-slate-50 border-slate-200 text-slate-400' 
                        : 'bg-white border-slate-200 text-slate-800 hover:border-[#0053a0] shadow-sm'
                    }`}>
                    
                    {/* Time Slot */}
                    <div className="w-28 flex-shrink-0 font-mono text-xs font-bold text-[#0053a0] bg-blue-50 px-2.5 py-1.5 rounded-md text-center border border-blue-100">
                      {block.time}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-bold text-sm flex items-center gap-2">
                        {block.name}
                        {block.type === 'break' && <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-normal">Pause</span>}
                        {block.type === 'coaching' && <span className="text-xs px-2 py-0.5 rounded bg-[#0053a0] text-white font-semibold">Coaching</span>}
                        {block.type === 'training' && <span className="text-xs px-2 py-0.5 rounded bg-[#a7e600] text-slate-900 font-semibold">Training</span>}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Dauer: {block.duration} Min</div>
                    </div>

                    {/* Actions */}
                    {!block.fixed && (
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => moveBlock(index, -1)} 
                          disabled={index === 0}
                          className="p-1.5 text-slate-400 hover:text-[#0053a0] disabled:opacity-30 rounded hover:bg-slate-100">
                          <Icon name="arrowUp" className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => moveBlock(index, 1)} 
                          disabled={index === schedule.length - 1}
                          className="p-1.5 text-slate-400 hover:text-[#0053a0] disabled:opacity-30 rounded hover:bg-slate-100">
                          <Icon name="arrowDown" className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeBlock(index)} 
                          className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 ml-2">
                          <Icon name="trash" className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* DIGITAL BACKPACK TAB */}
        {activeTab === 'backpack' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="bg-[#a7e600] p-3 rounded-xl text-slate-900 shadow-sm">
                <Icon name="backpack" className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#0053a0]">Digitaler Backpack / Packliste</h2>
                <p className="text-sm text-slate-500">Automatisch berechnetes Material für {groupSize} Teilnehmer basierend auf dem aktuellen Fahrplan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {backpackItems.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{item.name}</span>
                  <span className="px-3 py-1 bg-[#0053a0] text-white rounded-full text-xs font-bold shadow-sm">
                    {item.qty}x benötigt
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* METHODEN BACKEND TAB */}
        {activeTab === 'backend' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6 max-w-4xl mx-auto">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-[#0053a0]">Methoden-Backend (Crowdsourcing)</h2>
              <p className="text-sm text-slate-500">Füge neue Bausteine & Methoden sukzessive zur Unternehmens-Datenbank hinzu.</p>
            </div>

            <form onSubmit={handleCreateMethod} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-md font-bold text-[#0053a0]">Neue Methode anlegen</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Methoden-Name</label>
                  <input 
                    type="text" value={newMethod.name} onChange={e => setNewMethod({...newMethod, name: e.target.value})}
                    placeholder="z.B. World Café" required
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0053a0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Typ</label>
                  <select 
                    value={newMethod.type} onChange={e => setNewMethod({...newMethod, type: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0053a0]">
                    <option value="training">Training</option>
                    <option value="coaching">Teamcoaching</option>
                    <option value="both">Beides</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Dauer (Minuten)</label>
                  <input 
                    type="number" value={newMethod.duration} onChange={e => setNewMethod({...newMethod, duration: Number(e.target.value)})}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0053a0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Benötigtes Material (kommagetrennt)</label>
                  <input 
                    type="text" value={newMethod.materials} onChange={e => setNewMethod({...newMethod, materials: e.target.value})}
                    placeholder="Flipchart, Post-its, Stifte"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0053a0]"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-[#a7e600] hover:bg-[#95cd00] text-slate-900 font-extrabold rounded-lg transition shadow flex items-center justify-center gap-2">
                <Icon name="plus" className="w-5 h-5" />
                Methode in Datenbank speichern
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// RENDERING
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
