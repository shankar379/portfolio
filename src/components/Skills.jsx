import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { FiArrowDown, FiArrowLeft, FiArrowRight, FiVolume2, FiVolumeX, FiZap } from 'react-icons/fi';
import { skills } from '../data/skills';
import './Skills.css';
const WatchScene = lazy(() => import('./WatchScene'));
const ACTIVATION = 0.1;
const STICKY_TOP = 80;
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  // eslint-disable-next-line react/prop-types
  componentDidCatch() { this.props.onError(); }
  // eslint-disable-next-line react/prop-types
  render() { return this.state.failed ? null : this.props.children; }
}
function useMediaQuery(media) {
  const [reduced, setReduced] = useState(() => window.matchMedia(media).matches);
  useEffect(() => {
    const query = window.matchMedia(media);
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [media]);
  return reduced;
}
const SOUND_URLS = {
  activate: `${import.meta.env.BASE_URL}sounds/ben-activate.mp3`,
  turn: `${import.meta.env.BASE_URL}sounds/ben-turn.mp3`,
  transform: `${import.meta.env.BASE_URL}sounds/ben-transform.mp3`,
  deactivate: `${import.meta.env.BASE_URL}sounds/ben-timeout.mp3`,
};
const MODEL_URL = `${import.meta.env.BASE_URL}models/omnitrix-orange-interactive.glb`;
// Warm the HTTP cache with the watch chunk, model and sounds while the browser is idle.
let preloaded = false;
function preloadWatchAssets() {
  if (preloaded) return;
  preloaded = true;
  import('./WatchScene').catch(() => {});
  [MODEL_URL, ...Object.values(SOUND_URLS)].forEach((url) => fetch(url, { priority: 'low' }).catch(() => {}));
}
function useDialSound(activeIndex) {
  const [enabled, setEnabled] = useState(false);
  const context = useRef(null);
  const buffers = useRef({});
  const previousIndex = useRef(activeIndex);
  const play = useCallback((name, volume = 0.6) => {
    const audio = context.current;
    const buffer = buffers.current[name];
    if (!audio || audio.state !== 'running' || !buffer) return;
    const source = audio.createBufferSource();
    const gain = audio.createGain();
    gain.gain.value = volume;
    source.buffer = buffer;
    source.connect(gain).connect(audio.destination);
    source.onended = () => { source.disconnect(); gain.disconnect(); };
    source.start();
  }, []);
  const toggle = async () => {
    if (enabled) { setEnabled(false); return; }
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!context.current) context.current = new AudioContextClass();
      const audio = context.current;
      await audio.resume();
      if (audio.state !== 'running') return;
      await Promise.all(Object.entries(SOUND_URLS).map(async ([name, url]) => {
        if (buffers.current[name]) return;
        const response = await fetch(url);
        buffers.current[name] = await audio.decodeAudioData(await response.arrayBuffer());
      }));
      setEnabled(true);
      play(activeIndex >= 0 ? 'turn' : 'activate');
    } catch { setEnabled(false); }
  };
  useEffect(() => {
    const previous = previousIndex.current;
    previousIndex.current = activeIndex;
    if (!enabled || previous === activeIndex) return;
    if (previous < 0 && activeIndex >= 0) play('activate', 0.7);
    else if (activeIndex < 0) play('deactivate', 0.6);
    else play('turn', 0.55);
  }, [activeIndex, enabled, play]);
  useEffect(() => () => { context.current?.close().catch(() => {}); }, []);
  return [enabled, toggle, play];
}
export default function Skills() {
  const track = useRef(null);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shortViewport = useMediaQuery('(max-height: 650px)');
  const directMode = reducedMotion || shortViewport;
  const [progress, setProgress] = useState(0);
  const [manualIndex, setManualIndex] = useState(-1);
  const [nearby, setNearby] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const scrollIndex = progress < ACTIVATION ? -1 : Math.min(skills.length - 1, Math.floor((progress - ACTIVATION) / (1 - ACTIVATION) * skills.length));
  const activeIndex = directMode ? manualIndex : scrollIndex;
  const skill = skills[Math.max(0, activeIndex)];
  const Icon = skill.Icon;
  const [soundEnabled, toggleSound, playSound] = useDialSound(activeIndex);
  const sceneReady = useCallback(() => setReady(true), []);
  const sceneFailed = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    const handle = idle(preloadWatchAssets, { timeout: 4000 });
    return () => cancelIdle(handle);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '1200px' });
    observer.observe(track.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (directMode) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.current.getBoundingClientRect();
      const distance = Math.max(1, rect.height - track.current.firstElementChild.offsetHeight);
      setProgress(Math.min(1, Math.max(0, (STICKY_TOP - rect.top) / distance)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [directMode]);
  const selectSkill = useCallback((index) => {
    const selected = Math.min(skills.length - 1, Math.max(0, index));
    if (directMode) { setManualIndex(selected); return; }
    const rect = track.current.getBoundingClientRect();
    const distance = rect.height - track.current.firstElementChild.offsetHeight;
    const target = ACTIVATION + ((selected + 0.35) / skills.length) * (1 - ACTIVATION);
    // Position directly to avoid traversing intermediate skills on explicit selection.
    window.scrollTo({ top: window.scrollY + rect.top - STICKY_TOP + target * distance, behavior: 'instant' });
  }, [directMode]);
  const activated = activeIndex >= 0;
  // Tapping the watch on a skill transforms; tapping the same skill again times out.
  const transformed = useRef(false);
  useEffect(() => { transformed.current = false; }, [activeIndex]);
  const activate = useCallback(() => {
    if (!activated) { selectSkill(0); return; }
    transformed.current = !transformed.current;
    if (soundEnabled) playSound(transformed.current ? 'transform' : 'deactivate', 0.7);
  }, [activated, soundEnabled, playSound, selectSkill]);
  return (
    <section id="skills" className={`skills${directMode ? ' skills--direct' : ''}`} aria-labelledby="skills-heading">
      <header className="skills-header">
        <span className="skills-label">( 01 ) &nbsp; The toolkit</span>
        <div className="skills-heading-row">
          <h2 id="skills-heading">Built different.<br /><span>One skill at a time.</span></h2>
          <p>Different challenges. The right tools.<br />Explore the stack behind what I build.</p>
        </div>
      </header>
      <div className="skills-scroll-track" ref={track}>
        <div className="skills-sticky">
          <div className="skills-watch-stage" aria-label="Interactive skill watch">
            <div className="skills-stage-top">
              <span className="skills-device-label"><i className={activated ? 'is-active' : ''} /> SKILL SELECTOR</span>
              <button className="skills-sound" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? 'Mute watch sounds' : 'Enable watch sounds'}>
                {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}<span>Sound {soundEnabled ? 'on' : 'off'}</span>
              </button>
            </div>
            <div className="skills-stage-grid" aria-hidden="true" />
            {nearby && !failed && <SceneBoundary onError={sceneFailed}><Suspense fallback={null}>
              <WatchScene progress={directMode ? (activated ? 1 : 0) : progress} activeIndex={activeIndex} skills={skills} reducedMotion={reducedMotion} onActivate={activate} onReady={sceneReady} onError={sceneFailed} />
            </Suspense></SceneBoundary>}
            {(!ready || failed) && <div className="skills-scene-fallback" role="status"><div className="skills-fallback-dial"><Icon aria-hidden="true" /></div><span>{failed ? 'Explore the toolkit below' : 'Preparing your selector…'}</span></div>}
            <div className="skills-stage-bottom">
              <span className="skills-stage-status">{activated ? `${String(activeIndex + 1).padStart(2, '0')} / ${String(skills.length).padStart(2, '0')} · ${skill.name}` : 'STANDBY · READY TO BUILD'}</span>
              {!activated ? <button className="skills-activate" onClick={activate}><FiZap /> Activate</button> : <span className="skills-scroll-hint"><FiArrowDown /> {directMode ? 'Choose a skill below' : 'Scroll to switch'}</span>}
            </div>
          </div>
          <div className="skills-information">
            <div className="skills-info-top"><span className="skills-label">{activated ? skill.category : 'A little curiosity goes a long way'}</span><span className="skills-info-count">{activated ? String(activeIndex + 1).padStart(2, '0') : '00'}<small> / 10</small></span></div>
            <div className="skills-copy" key={activated ? skill.id : 'idle'}>
              <div className="skills-detail-icon" aria-hidden="true">{activated ? <Icon /> : <FiZap />}</div>
              <h3>{activated ? skill.name : 'Choose your capability.'}</h3>
              <p>{activated ? skill.description : directMode ? 'A toolkit for turning ideas into working products. Activate the watch or choose a skill below to discover what it brings to the build.' : 'A toolkit for turning ideas into working products. Scroll to wake the watch, turn the dial, and discover what each skill brings to the build.'}</p>
              <div className="skills-tags">{(activated ? skill.tags : ['Web', 'Mobile', 'Cloud', '3D']).map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="skills-navigation">
              <div className="skills-navigation-title"><span>EXPLORE THE STACK</span><div className="skills-arrows"><button onClick={() => selectSkill(activeIndex - 1)} disabled={activeIndex <= 0} aria-label="Previous skill"><FiArrowLeft /></button><button onClick={() => selectSkill(activeIndex + 1)} disabled={activeIndex === skills.length - 1} aria-label={activated ? 'Next skill' : 'Activate first skill'}><FiArrowRight /></button></div></div>
              <div className="skills-index" aria-label="Choose a skill">{skills.map((item, index) => <button key={item.id} onClick={() => selectSkill(index)} aria-pressed={activeIndex === index} className={activeIndex === index ? 'is-selected' : ''}><item.Icon aria-hidden="true" /><span>{item.name}</span></button>)}</div>
            </div>
            <span className="skills-sr-only" role="status" aria-live="polite">{activated ? `Selected ${skill.name}. ${skill.description}` : 'Watch idle. Activate or select a skill to begin.'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}


