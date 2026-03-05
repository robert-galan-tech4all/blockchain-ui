// ── Field ──────────────────────────────────────────────────────────────────
export function Field({ label, value, onChange, disabled, type = "text", hint,required }) {
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 4 }}>
        {label}
      </div>
      {hint && <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{hint}</div>}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box" }}
      />
    </div>
  );
}

// ── TextArea ──────────────────────────────────────────────────────────────
export function TextArea({ label, value, onChange, hint }) {
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 4 }}>{label}</div>
      {hint && <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{hint}</div>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
      />
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, disabled }) {
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 4 }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box", background: "white" }}
      >
        <option value="">— Seleziona —</option>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

// ── YesNoRadio ────────────────────────────────────────────────────────────
export function YesNoRadio({ label, value, onChange, name,required }) {
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 16 }}>
        {["SI", "NO"].map((opt) => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 700 }}>
            <input required={required} type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

// ── UnitQtyInput ──────────────────────────────────────────────────────────
// Combined quantity + kg/ton selector
export function UnitQtyInput({ label, qty, onQtyChange, unit, onUnitChange,required}) {
  return (
    <div>
      <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
            required={required}
          type="number"
          value={qty}
          onChange={(e) => onQtyChange(e.target.value)}
          style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box" }}
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          style={{ width: 90, padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box", background: "white" }}
        >
          <option value="kg">kg</option>
          <option value="ton">ton</option>
        </select>
      </div>
    </div>
  );
}

// ── LottoIdInput ──────────────────────────────────────────────────────────
export function LottoIdInput({ value, onChange, autoFocus }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <input value="GD-" readOnly
        style={{ width: 90, padding: 12, borderRadius: 12, border: "1px solid #ddd", background: "#f2f2f2", boxSizing: "border-box", fontWeight: 800, textAlign: "center" }} />
      <input value={value} onChange={(e) => onChange(e.target.value)} autoFocus={autoFocus}
        style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #ddd", boxSizing: "border-box" }} />
    </div>
  );
}

// ── ValidationMsg ─────────────────────────────────────────────────────────
export function ValidationMsg({ msg }) {
  if (!msg) return null;
  return <div style={{ marginTop: 8, color: "#b00020", fontSize: 13, fontWeight: 800 }}>{msg}</div>;
}

// ── StatusMsg ─────────────────────────────────────────────────────────────
export function StatusMsg({ msg }) {
  if (!msg) return null;
  return <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, whiteSpace: "pre-wrap" }}>{msg}</div>;
}

// ── ModalOverlay ──────────────────────────────────────────────────────────
export function ModalOverlay({ onClose, maxWidth = 560, children }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 10000 }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth, background: "white", borderRadius: 16, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", fontFamily: "Lato, system-ui, sans-serif", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ── ModalButtons ──────────────────────────────────────────────────────────
export function ModalButtons({ onCancel, confirmLabel = "OK", cancelLabel = "ANNULLA", loading, confirmStyle = {} }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
      <button type="button" onClick={onCancel} disabled={loading}
        style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #ddd", background: "white", fontWeight: 800, cursor: "pointer" }}>
        {cancelLabel}
      </button>
      <button type="submit" disabled={loading}
        style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#111", color: "white", fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, ...confirmStyle }}>
        {loading ? "Invio..." : confirmLabel}
      </button>
    </div>
  );
}

// ── SectionTitle ──────────────────────────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <div style={{ fontWeight: 1000, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#888", margin: "16px 0 8px" }}>
      {children}
    </div>
  );
}

// ── KVTable ───────────────────────────────────────────────────────────────
export function KVTable({ title, data }) {
  const entries = Object.entries(data || {});
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: 12, background: "#f6f7fb", fontWeight: 1000, fontSize: 15 }}>{title}</div>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr" }}>
        {entries.length === 0 ? (
          <div style={{ gridColumn: "1/-1", padding: 12, color: "#999" }}>Nessun dato presente.</div>
        ) : entries.map(([k, v]) => (
          <div key={k} style={{ display: "contents" }}>
            <div style={{ padding: "10px 12px", borderTop: "1px solid #eee", background: "#fbfbfd", fontWeight: 900, fontSize: 13 }}>{k}</div>
            <div style={{ padding: "10px 12px", borderTop: "1px solid #eee", fontWeight: 700, fontSize: 13, whiteSpace: "pre-wrap" }}>
              {v === null || v === undefined ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FasiTable({ title, data }) {
  // Ensure data is an array
  const fasiArray = Array.isArray(data) ? data : [data];
  
//   console.log("All fasi:", fasiArray);
  
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ padding: 12, background: "#f6f7fb", fontWeight: 1000, fontSize: 15, borderRadius: "14px 14px 0 0" }}>
        {title} ({fasiArray.length})
      </div>
      
      {fasiArray.map((fase, index) => {
        // Get the actual fase data (handle both direct objects and objects with dettagli)
        const faseData = fase.dettagli || fase;
        
        // Flatten the object to handle nested structures
        const flattenedEntries = flattenObject(faseData || {});
        
        return (
          <div key={index} style={{ 
            border: "1px solid #eee", 
            borderRadius: index === fasiArray.length - 1 ? "0 0 14px 14px" : 0,
            borderTop: index > 0 ? "none" : "1px solid #eee",
            overflow: "hidden"
          }}>
            {fasiArray.length > 1 && (
              <div style={{ 
                padding: "8px 12px", 
                background: "#f0f2f5", 
                fontWeight: 600, 
                fontSize: 12,
                borderBottom: "1px solid #ddd"
              }}>
                Fase {index + 1}: {fase.nome || faseData.nome || `Fase ${index + 1}`}
              </div>
            )}
            
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr" }}>
              {flattenedEntries.length === 0 ? (
                <div style={{ gridColumn: "1/-1", padding: 12, color: "#999" }}>Nessun dato presente.</div>
              ) : flattenedEntries.map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}>
                  <div style={{ 
                    padding: "10px 12px", 
                    borderTop: "1px solid #eee", 
                    background: "#fbfbfd", 
                    fontWeight: 900, 
                    fontSize: 13 
                  }}>
                    {formatKey(k)}
                  </div>
                  <div style={{ 
                    padding: "10px 12px", 
                    borderTop: "1px solid #eee", 
                    fontWeight: 700, 
                    fontSize: 13, 
                    whiteSpace: "pre-wrap" 
                  }}>
                    {formatValue(v)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Helper function to flatten nested objects
function flattenObject(obj, prefix = '') {
  let result = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    // Handle arrays of objects (like coppie_carico)
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      // For arrays of objects, create a special formatted display
      result.push([newKey, value]);
    }
    // Handle nested objects (like qualita)
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively flatten nested objects
      const nestedEntries = flattenObject(value, newKey);
      result = [...result, ...nestedEntries];
    } else {
      result.push([newKey, value]);
    }
  }
  
  return result;
}

// Helper function to format keys
function formatKey(key) {
  const keyMap = {
    'codice_appezzamento': 'Codice Appezzamento',
    'superficie_ha': 'Superficie (ha)',
    'gps_lat': 'Latitudine GPS',
    'gps_lon': 'Longitudine GPS',
    'timestamp_fase': 'Data e Ora',
    'operatore': 'Operatore',
    'comune': 'Comune',
    'provincia': 'Provincia',
    'nome': 'Nome Fase',
    'altre_info': 'Altre Informazioni',
    'data_scarico': 'Data Scarico',
    'km_percorsi': 'Km Percorsi',
    'luogo_carico': 'Luogo Carico',
    'luogo_scarico': 'Luogo Scarico',
    'nomi_trebbie': 'Nomi Trebbie',
    'numero_trebbie': 'Numero Trebbie',
    'quantita': 'Quantità',
    'luogo_consegna': 'Luogo Consegna',
    'luogo_partenza': 'Luogo Partenza',
    'peso': 'Peso',
    'analisi_varietale': 'Analisi Varietale',
    // Qualità fields
    'qualita.umidita': 'Umidità (%)',
    'qualita.impurita': 'Impurità (%)',
    'qualita.peso_specifico': 'Peso Specifico (kg/hl)',
    'qualita.proteine': 'Proteine (%)',
    'qualita.difettosita': 'Difettosità (%)',
    // Coppie fields
    'coppie_carico': 'Coppie di Carico'
  };
  
  return keyMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to format values
function formatValue(value) {
  if (value === null || value === undefined) return "—";
  
  // Format timestamp
  if (typeof value === 'string' && value.includes('T') && value.includes('+')) {
    try {
      const date = new Date(value);
      return date.toLocaleString('it-IT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return value;
    }
  }
  
  // Handle arrays of objects (like coppie_carico)
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {value.map((item, idx) => (
          <div key={idx} style={{ 
            background: '#f5f5f5', 
            padding: '8px', 
            borderRadius: '4px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '4px', color: '#666' }}>
              Coppia {idx + 1}:
            </div>
            {Object.entries(item).map(([k, v]) => (
              <div key={k} style={{ 
                display: 'grid', 
                gridTemplateColumns: '120px 1fr',
                fontSize: '12px',
                marginBottom: '2px'
              }}>
                <span style={{ color: '#666' }}>{formatKey(k)}:</span>
                <span style={{ fontWeight: 500 }}>{formatValue(v)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  
  // Handle objects (should be flattened by flattenObject, but just in case)
  if (typeof value === 'object') {
    if (value.nome) return value.nome;
    return JSON.stringify(value, null, 2);
  }
  
  return String(value);
}
// ── FaseRadioList ─────────────────────────────────────────────────────────
export function FaseRadioList({ options, value, onChange, name }) {
  return (
    <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
      {options.map(({ value: optValue, label }) => (
        <label
          key={optValue}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            cursor: "pointer",
            background: value === optValue ? "#f6f7fb" : "white",
            fontWeight: 900,
            userSelect: "none",
          }}
        >
          <input
            type="radio"
            name={name}
            value={optValue}
            checked={value === optValue}
            onChange={() => onChange(optValue)}
            style={{ width: 18, height: 18 }}
          />
          <span style={{ fontSize: 18 }}>{label}</span>
        </label>
      ))}
    </div>
  );
}