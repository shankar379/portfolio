import{j as B}from"./framer-motion-CXhxFg8T.js";import{r as t}from"./react-vendor-Bxt1C2Z2.js";import{S as M,O as E,W as O,P as k,a as y,V as I,M as N}from"./three-vendor-DkVKcZRz.js";const H=()=>{const e=t.useRef(null),R=t.useRef(null),x=t.useRef(null),u=t.useRef(null),a=t.useRef(null),f=t.useRef(null),i=typeof window<"u"&&(window.innerWidth<=768||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),n=t.useRef(0),d=t.useRef(!0);return t.useEffect(()=>{if(!e.current)return;const v=new M;R.current=v;const m=new E(-1,1,1,-1,0,1);x.current=m;let c;try{c=new O({antialias:!i,alpha:!1,powerPreference:"high-performance"})}catch(r){console.warn("WebGL unavailable — using static background.",r);return}c.setSize(e.current.clientWidth,e.current.clientHeight),c.setPixelRatio(i?Math.min(window.devicePixelRatio,1):Math.min(window.devicePixelRatio,2)),e.current.appendChild(c.domElement);const l=c.domElement;u.current=c;const h=new k(2,2),g=new y({uniforms:{uTime:{value:0},uResolution:{value:new I(e.current.clientWidth,e.current.clientHeight)}},fragmentShader:`
        precision highp float;

        uniform float uTime;
        uniform vec2 uResolution;

        // Exact color palette
        const vec3 c1 = vec3(1.0, 0.2824, 0.0);    // #ff4800
        const vec3 c2 = vec3(1.0, 0.3294, 0.0);    // #ff5400
        const vec3 c3 = vec3(1.0, 0.3765, 0.0);    // #ff6000
        const vec3 c4 = vec3(1.0, 0.4275, 0.0);    // #ff6d00
        const vec3 c5 = vec3(1.0, 0.4745, 0.0);    // #ff7900
        const vec3 c6 = vec3(1.0, 0.5216, 0.0);    // #ff8500
        const vec3 c7 = vec3(1.0, 0.5686, 0.0);    // #ff9100
        const vec3 c8 = vec3(1.0, 0.6196, 0.0);    // #ff9e00
        const vec3 c9 = vec3(1.0, 0.6667, 0.0);    // #ffaa00
        const vec3 c10 = vec3(1.0, 0.7137, 0.0);   // #ffb600

        // Flowing wave
        float wave(vec2 p, float speed, float freq, float amp) {
          return sin(p.x * freq + uTime * speed) * amp + 
                 sin(p.x * freq * 1.3 + uTime * speed * 0.7) * amp * 0.5;
        }

        // Curve function
        float curve(vec2 uv, float yOffset, float waveAmp) {
          float diag = uv.y - (uv.x * 0.65 - 0.15);
          float w = wave(uv, 0.5, 3.5, waveAmp);
          return diag - yOffset + w;
        }

        // RAZOR SHARP edge - hair-thin boundary
        float razorEdge(float dist, float width) {
          return step(abs(dist), width);
        }

        // Ultra sharp mask with minimal feathering
        float ultraSharpMask(float dist, float width) {
          return smoothstep(width + 0.005, width - 0.005, abs(dist));
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          float aspect = uResolution.x / uResolution.y;
          uv.x *= aspect;
          uv.x -= 0.15; // Shift pattern to the right

          // Clean white background
          vec3 bg = vec3(1.0);
          bg = mix(bg, vec3(1.0, 0.98, 0.96), uv.y * 0.15);
          
          vec3 color = bg;

          // RIBBON 1 - Bottom darkest with INSTANT color switches
          float r1 = curve(uv, -0.28, 0.04);
          float m1 = ultraSharpMask(r1, 0.26);
          
          // SUDDEN color bands - no gradients!
          vec3 g1 = c1;
          float band = mod(r1 * 8.0, 1.0);
          if (band > 0.2 && band < 0.4) g1 = c2;
          else if (band > 0.4 && band < 0.6) g1 = c3;
          else if (band > 0.6 && band < 0.8) g1 = c4;
          else if (band > 0.8) g1 = c5;
          
          color = mix(color, g1, m1);
          
          // Hair-thin edge highlight
          float edge1 = razorEdge(r1, 0.001);
          color += vec3(1.0, 0.6, 0.4) * edge1 * 0.5;

          // RIBBON 2 - Sharp color bands
          float r2 = curve(uv, -0.14, 0.038);
          float m2 = ultraSharpMask(r2, 0.24);
          
          vec3 g2 = c2;
          float band2 = fract((r2 + 0.3) * 6.0);
          if (band2 > 0.25 && band2 < 0.5) g2 = c4;
          else if (band2 > 0.5 && band2 < 0.75) g2 = c5;
          else if (band2 > 0.75) g2 = c6;
          
          color = mix(color, g2, m2 * 0.92);
          
          float edge2 = razorEdge(r2, 0.001);
          color += vec3(1.0, 0.7, 0.5) * edge2 * 0.4;

          // RIBBON 3 - Middle bright with energy bands
          float r3 = curve(uv, 0.0, 0.036);
          float m3 = ultraSharpMask(r3, 0.28);
          
          vec3 g3 = c4;
          float band3 = fract((r3 + 0.5) * 7.0);
          if (band3 > 0.15 && band3 < 0.35) g3 = c5;
          else if (band3 > 0.35 && band3 < 0.55) g3 = c6;
          else if (band3 > 0.55 && band3 < 0.75) g3 = c7;
          else if (band3 > 0.75) g3 = c8;
          
          color = mix(color, g3, m3 * 0.88);
          
          float edge3 = razorEdge(r3, 0.0015);
          color += vec3(1.0, 0.8, 0.6) * edge3 * 0.45;

          // RIBBON 4 - Distinct color stripes
          float r4 = curve(uv, 0.16, 0.034);
          float m4 = ultraSharpMask(r4, 0.26);
          
          vec3 g4 = c5;
          float stripe4 = step(0.5, fract((r4 + 0.2) * 10.0));
          g4 = mix(c6, c7, stripe4);
          if (fract((r4 + 0.2) * 10.0) > 0.7) g4 = c8;
          
          color = mix(color, g4, m4 * 0.78);

          // RIBBON 5 - Bright energy bands
          float r5 = curve(uv, 0.32, 0.032);
          float m5 = ultraSharpMask(r5, 0.24);
          
          vec3 g5 = c7;
          float pulse5 = fract((r5 + uTime * 0.1) * 5.0);
          if (pulse5 > 0.3 && pulse5 < 0.6) g5 = c8;
          else if (pulse5 > 0.6) g5 = c9;
          
          color = mix(color, g5, m5 * 0.68);

          // RIBBON 6 - Light bands
          float r6 = curve(uv, 0.48, 0.03);
          float m6 = ultraSharpMask(r6, 0.22);
          
          vec3 g6 = c9;
          if (fract((r6 + 0.4) * 8.0) > 0.5) g6 = c10;
          
          color = mix(color, g6, m6 * 0.58);

          // RIBBON 7 - Top lightest
          float r7 = curve(uv, 0.62, 0.028);
          float m7 = ultraSharpMask(r7, 0.2);
          vec3 g7 = mix(c10, vec3(1.0, 0.92, 0.85), 0.5);
          color = mix(color, g7, m7 * 0.45);

          // HAIR-THIN highlight lines - razor sharp!
          float line1 = curve(uv, -0.18, 0.026);
          color += vec3(1.0, 0.85, 0.7) * step(abs(line1), 0.0015) * 1.0;

          float line2 = curve(uv, 0.05, 0.024);
          color += vec3(1.0, 0.9, 0.82) * step(abs(line2), 0.0012) * 0.85;

          float line3 = curve(uv, 0.24, 0.022);
          color += vec3(1.0, 0.94, 0.88) * step(abs(line3), 0.001) * 0.7;

          float line4 = curve(uv, 0.4, 0.02);
          color += vec3(1.0, 0.97, 0.92) * step(abs(line4), 0.0008) * 0.55;

          // Additional ULTRA-THIN accent lines
          float accent1 = curve(uv, -0.22, 0.025);
          color += vec3(1.0, 0.75, 0.6) * step(abs(accent1), 0.0005) * 0.6;

          float accent2 = curve(uv, 0.12, 0.023);
          color += vec3(1.0, 0.88, 0.75) * step(abs(accent2), 0.0005) * 0.5;

          // Subtle vignette
          vec2 vUV = (uv / aspect - 0.5) * 2.0;
          float vignette = 1.0 - smoothstep(0.5, 1.5, length(vUV));
          color *= 0.95 + vignette * 0.05;

          gl_FragColor = vec4(color, 1.0);
        }
      `});a.current=g;const S=new N(h,g);v.add(S);const p=1e3/(i?30:60);n.current=performance.now(),d.current=!0;let s=null;setTimeout(()=>{s=new IntersectionObserver(r=>{r.forEach(o=>{d.current=o.isIntersecting})},{threshold:.01,rootMargin:"50px"}),e.current&&s.observe(e.current)},100);const b=r=>{if(f.current=requestAnimationFrame(b),i){const o=r-n.current;if(o<p)return;n.current=r-o%p}else n.current=r;!d.current&&r-n.current>1e3||(a.current&&(a.current.uniforms.uTime.value+=.01),c.render(v,m))};b(performance.now());const w=()=>{if(!e.current||!u.current||!a.current)return;const r=e.current.clientWidth,o=e.current.clientHeight;u.current.setSize(r,o),a.current.uniforms.uResolution.value.set(r,o)};return window.addEventListener("resize",w),()=>{s&&s.disconnect(),window.removeEventListener("resize",w),f.current&&cancelAnimationFrame(f.current),l&&l.parentNode&&l.parentNode.removeChild(l),c.dispose(),g.dispose(),h.dispose()}},[]),B.jsx("div",{ref:e,className:"orange-ribbon-background"})};export{H as default};
