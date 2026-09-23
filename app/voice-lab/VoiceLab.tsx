"use client";

import { useEffect, useMemo, useState } from "react";

type PresetKey = "story" | "hero" | "villain" | "npc" | "horror" | "whisper";

const presets: Record<PresetKey, {
  label: string;
  sub: string;
  rate: number;
  pitch: number;
  volume: number;
  sample: string;
}> = {
  story: {
    label: "Story Mode",
    sub: "Measured, cinematic narration",
    rate: 0.88,
    pitch: 0.95,
    volume: 1,
    sample: "The road ahead was quiet. Too quiet. Somewhere beyond the trees, something was waiting.",
  },
  hero: {
    label: "Hero",
    sub: "Clear, confident character delivery",
    rate: 0.98,
    pitch: 1.03,
    volume: 1,
    sample: "Stay behind me. Whatever is down there, we finish this together.",
  },
  villain: {
    label: "Villain",
    sub: "Slow, controlled and threatening",
    rate: 0.78,
    pitch: 0.78,
    volume: 1,
    sample: "You came all this way thinking you could stop me. That was your first mistake.",
  },
  npc: {
    label: "NPC",
    sub: "Natural conversational game dialogue",
    rate: 1,
    pitch: 1,
    volume: 0.96,
    sample: "If you're heading north, take the old bridge. The main road hasn't been safe for days.",
  },
  horror: {
    label: "Horror",
    sub: "Uneasy pacing and lower delivery",
    rate: 0.72,
    pitch: 0.72,
    volume: 0.92,
    sample: "I heard it again last night. Three knocks from inside the wall. Then my name.",
  },
  whisper: {
    label: "Whisper",
    sub: "Soft, close and restrained",
    rate: 0.82,
    pitch: 0.9,
    volume: 0.55,
    sample: "Don't turn around. Just keep walking, and whatever you hear, do not answer it.",
  },
};

export default function VoiceLab() {
  const [preset, setPreset] = useState<PresetKey>("story");
  const [text, setText] = useState(presets.story.sample);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [status, setStatus] = useState("Ready");
  const [rate, setRate] = useState(presets.story.rate);
  const [pitch, setPitch] = useState(presets.story.pitch);
  const [volume, setVolume] = useState(presets.story.volume);

  useEffect(() => {
    const load = () => {
      const list = window.speechSynthesis?.getVoices?.() || [];
      setVoices(list);
      if (!voiceName && list.length) {
        const english = list.find(v => /^en(-|_)/i.test(v.lang));
        setVoiceName((english || list[0]).name);
      }
    };
    load();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = load;
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voiceName]);

  const selectedVoice = useMemo(
    () => voices.find(v => v.name === voiceName),
    [voices, voiceName]
  );

  function choosePreset(key: PresetKey) {
    const p = presets[key];
    setPreset(key);
    setRate(p.rate);
    setPitch(p.pitch);
    setVolume(p.volume);
    setText(p.sample);
  }

  function speak() {
    if (!("speechSynthesis" in window)) {
      setStatus("Speech synthesis is not supported in this browser.");
      return;
    }
    const clean = text.trim();
    if (!clean) {
      setStatus("Type a line first.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    if (selectedVoice) u.voice = selectedVoice;
    u.rate = Math.max(0.5, Math.min(1.5, rate));
    u.pitch = Math.max(0.5, Math.min(1.5, pitch));
    u.volume = Math.max(0, Math.min(1, volume));
    u.onstart = () => setStatus("Playing");
    u.onend = () => setStatus("Ready");
    u.onerror = () => setStatus("Could not play this voice.");
    window.speechSynthesis.speak(u);
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setStatus("Stopped");
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #1a2235 0%, #0b0f17 48%, #070a10 100%)",
      color: "#f6f7fb",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      padding: "28px 18px 64px"
    }}>
      <div style={{maxWidth: 1080, margin: "0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",marginBottom:34,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:12,letterSpacing:2.4,textTransform:"uppercase",color:"#98a7c2",marginBottom:8}}>NDSOFT EXPERIMENT</div>
            <h1 style={{fontSize:"clamp(34px,6vw,64px)",lineHeight:0.95,margin:0,fontWeight:800,letterSpacing:-2}}>Voice Lab</h1>
          </div>
          <div style={{padding:"9px 13px",border:"1px solid #2d374b",borderRadius:999,color:"#bac6d8",fontSize:13}}>Local prototype • no audio uploaded</div>
        </div>

        <p style={{maxWidth:720,fontSize:18,lineHeight:1.6,color:"#bdc7d8",marginBottom:30}}>
          Type game dialogue, choose a performance style, then hear it delivered with character-focused pacing and tone. This first build uses voices already available on your device while the higher-fidelity synthesis backend is evaluated.
        </p>

        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,marginBottom:22}}>
          {(Object.keys(presets) as PresetKey[]).map(key => {
            const p = presets[key];
            const active = preset === key;
            return (
              <button key={key} onClick={() => choosePreset(key)} style={{
                textAlign:"left",padding:"16px 15px",minHeight:96,borderRadius:16,cursor:"pointer",
                border: active ? "1px solid #9fc1ff" : "1px solid #273247",
                background: active ? "#17243a" : "#101722", color:"#fff"
              }}>
                <div style={{fontWeight:750,fontSize:15,marginBottom:6}}>{p.label}</div>
                <div style={{fontSize:12,lineHeight:1.4,color: active ? "#c8d9f7" : "#8492a8"}}>{p.sub}</div>
              </button>
            );
          })}
        </section>

        <section style={{border:"1px solid #263146",background:"#0d131e",borderRadius:22,padding:"clamp(18px,4vw,28px)"}}>
          <label htmlFor="dialogue" style={{display:"block",fontSize:13,fontWeight:700,letterSpacing:0.5,marginBottom:10,color:"#dbe4f2"}}>DIALOGUE</label>
          <textarea
            id="dialogue"
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={900}
            style={{
              width:"100%",minHeight:170,resize:"vertical",boxSizing:"border-box",
              border:"1px solid #2d3950",borderRadius:14,background:"#080d15",color:"#f5f7fb",
              fontSize:20,lineHeight:1.55,padding:18,outline:"none"
            }}
          />
          <div style={{display:"flex",justifyContent:"space-between",gap:14,marginTop:8,color:"#718198",fontSize:12}}>
            <span>{presets[preset].label}</span><span>{text.length}/900</span>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:16,marginTop:24}}>
            <label style={{fontSize:13,color:"#aab6c8"}}>
              Device voice
              <select value={voiceName} onChange={e => setVoiceName(e.target.value)} style={{
                width:"100%",marginTop:8,padding:"12px 10px",borderRadius:10,background:"#101824",color:"#fff",border:"1px solid #2b3850",fontSize:15
              }}>
                {voices.map(v => <option key={v.name + v.lang} value={v.name}>{v.name} ({v.lang})</option>)}
              </select>
            </label>
            <label style={{fontSize:13,color:"#aab6c8"}}>
              Pace <strong style={{color:"#fff"}}>{rate.toFixed(2)}x</strong>
              <input type="range" min="0.5" max="1.35" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} style={{width:"100%",marginTop:16}} />
            </label>
            <label style={{fontSize:13,color:"#aab6c8"}}>
              Character pitch <strong style={{color:"#fff"}}>{pitch.toFixed(2)}</strong>
              <input type="range" min="0.55" max="1.35" step="0.01" value={pitch} onChange={e => setPitch(Number(e.target.value))} style={{width:"100%",marginTop:16}} />
            </label>
          </div>

          <div style={{display:"flex",gap:10,marginTop:26,flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={speak} style={{
              border:0,borderRadius:12,padding:"14px 22px",background:"#f0f4ff",color:"#0b1019",fontWeight:800,fontSize:15,cursor:"pointer"
            }}>▶ Generate & Play</button>
            <button onClick={stop} style={{
              border:"1px solid #344159",borderRadius:12,padding:"13px 18px",background:"#131b28",color:"#d8e0ec",fontWeight:700,fontSize:15,cursor:"pointer"
            }}>■ Stop</button>
            <span aria-live="polite" style={{fontSize:13,color:"#8191aa",marginLeft:4}}>{status}</span>
          </div>
        </section>

        <section style={{marginTop:22,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>
          <div style={{padding:18,border:"1px solid #222d40",borderRadius:16,background:"#0b111b"}}>
            <div style={{fontWeight:750,marginBottom:6}}>Next: neural performance</div>
            <div style={{fontSize:13,lineHeight:1.55,color:"#8795aa"}}>Replace device speech with a neural TTS provider while keeping these performance presets as the direction layer.</div>
          </div>
          <div style={{padding:18,border:"1px solid #222d40",borderRadius:16,background:"#0b111b"}}>
            <div style={{fontWeight:750,marginBottom:6}}>Game-focused controls</div>
            <div style={{fontSize:13,lineHeight:1.55,color:"#8795aa"}}>Character identity, emotion, scene context, intensity, whispering, shouting, breaths and multi-line dialogue.</div>
          </div>
          <div style={{padding:18,border:"1px solid #222d40",borderRadius:16,background:"#0b111b"}}>
            <div style={{fontWeight:750,marginBottom:6}}>Export target</div>
            <div style={{fontSize:13,lineHeight:1.55,color:"#8795aa"}}>Production version should render WAV/MP3 files ready to drop into Godot, Unity or Unreal dialogue systems.</div>
          </div>
        </section>
      </div>
    </main>
  );
}
