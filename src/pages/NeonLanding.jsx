import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NeonLanding() {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const reflectionRef = useRef(null);
  const burstRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if logged in
  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  // Particles
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const x = c.getContext('2d');
    let w, h, dots = [], raf;

    function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      dots.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.1,
      });
    }

    function draw() {
      x.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0) d.x = w; if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h; if (d.y > h) d.y = 0;
        x.beginPath(); x.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        x.fillStyle = `rgba(0,229,255,${d.o})`; x.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  // Animation sequence
  useEffect(() => {
    const logo = logoRef.current;
    const reflection = reflectionRef.current;
    const burst = burstRef.current;
    const tagline = taglineRef.current;
    const cta = ctaRef.current;
    if (!logo) return;

    const letters = logo.querySelectorAll('.letter');
    const delay = 400;

    letters.forEach((l, i) => {
      setTimeout(() => {
        l.style.opacity = '1';
        l.style.transform = 'translateY(0)';
        l.style.filter = 'blur(0)';
        l.style.transition = 'opacity .25s ease, transform .25s ease, filter .25s ease';
        l.style.color = '#fff';
        l.style.textShadow = '0 0 4px #FFE066';
      }, delay + i * 250);
    });

    const burstTime = delay + letters.length * 250 + 300;

    setTimeout(() => {
      logo.classList.add('flicker');
      burst.classList.add('active');
    }, burstTime);

    setTimeout(() => {
      logo.classList.remove('flicker');
      logo.classList.add('glow-steady');
      reflection.classList.add('show');
      tagline.classList.add('show');
    }, burstTime + 700);

    setTimeout(() => {
      cta.classList.add('show');
    }, burstTime + 1500);
  }, []);

  return (
    <>
      <style>{`
        .neon-landing { width: 100%; height: 100vh; overflow: hidden; background: #000 url('/bg-hero.jpg') center/cover no-repeat; font-family: 'Orbitron', sans-serif; position: fixed; top: 0; left: 0; z-index: 9999; }
        .neon-landing::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.7); z-index: 0; }
        .neon-landing canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
        .neon-landing .nl-container { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; user-select: none; }
        .neon-landing .logo-wrap { position: relative; margin-bottom: 8px; }
        .neon-landing .logo { font-size: clamp(3rem, 12vw, 8rem); font-weight: 900; color: #fff; letter-spacing: .08em; display: flex; justify-content: center; }
        .neon-landing .logo .letter { opacity: 0; transform: translateY(20px); display: inline-block; filter: blur(4px); }
        .neon-landing .logo.glow-steady { text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #FFE066, 0 0 82px #FFE066, 0 0 92px #FFE066, 0 0 102px #FFE066, 0 0 151px #FCD535; animation: nl-breathe 3s ease-in-out infinite; }
        .neon-landing .logo.flicker { animation: nl-neonFlicker .6s steps(1) 1; }
        @keyframes nl-breathe { 0%, 100% { text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #FFE066, 0 0 82px #FFE066, 0 0 92px #FFE066, 0 0 102px #FFE066, 0 0 151px #FCD535; } 50% { text-shadow: 0 0 4px #fff, 0 0 7px #fff, 0 0 14px #fff, 0 0 30px #FFE066, 0 0 60px #FFE066, 0 0 70px #FFE066, 0 0 80px #FCD535, 0 0 110px #FCD535; } }
        @keyframes nl-neonFlicker { 0% { opacity: 1; text-shadow: 0 0 7px #fff, 0 0 42px #FFE066, 0 0 120px #FFE066; } 10% { opacity: 0; } 20% { opacity: 1; } 30% { opacity: 0; } 40% { opacity: 1; } 50% { opacity: .3; } 60% { opacity: 1; } 100% { opacity: 1; text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #FFE066, 0 0 82px #FFE066, 0 0 92px #FFE066, 0 0 102px #FFE066, 0 0 151px #FCD535; } }
        .neon-landing .burst { position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: radial-gradient(circle, rgba(0,229,255,.6) 0%, transparent 70%); transform: translate(-50%, -50%); pointer-events: none; opacity: 0; }
        .neon-landing .burst.active { animation: nl-burstAnim .8s ease-out forwards; }
        @keyframes nl-burstAnim { 0% { width: 0; height: 0; opacity: .9; } 100% { width: 140vw; height: 140vw; opacity: 0; } }
        .neon-landing .reflection { font-size: clamp(3rem, 12vw, 8rem); font-weight: 900; color: #FFE066; letter-spacing: .08em; transform: scaleY(-1); opacity: 0; mask-image: linear-gradient(to bottom, rgba(0,0,0,.25) 0%, transparent 60%); -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,.25) 0%, transparent 60%); filter: blur(2px); pointer-events: none; transition: opacity 1s; }
        .neon-landing .reflection.show { opacity: 1; }
        .neon-landing .tagline { font-size: clamp(.8rem, 2.5vw, 1.3rem); color: #FFE066; letter-spacing: .3em; text-transform: uppercase; opacity: 0; margin-top: 24px; text-shadow: 0 0 7px #FFE066, 0 0 20px #FCD535; transition: opacity 1.5s; }
        .neon-landing .tagline.show { opacity: .7; }
        .neon-landing .cta { margin-top: 48px; opacity: 0; transform: translateY(40px); }
        .neon-landing .cta.show { opacity: 1; transform: translateY(0); transition: opacity .8s ease, transform .8s cubic-bezier(.34, 1.56, .64, 1); }
        .neon-landing .cta button { display: inline-block; padding: 18px 48px; font-family: 'Orbitron', sans-serif; font-size: clamp(.9rem, 2vw, 1.2rem); font-weight: 700; color: #FFE066; background: transparent; border: 2px solid #FFE066; border-radius: 4px; text-transform: uppercase; letter-spacing: .15em; cursor: pointer; box-shadow: 0 0 10px #FFE06644, 0 0 40px #FFE06622, inset 0 0 10px #FFE06611; transition: all .3s ease; }
        .neon-landing .cta button:hover { background: #FFE066; color: #000; box-shadow: 0 0 20px #FFE066, 0 0 60px #FFE06688, 0 0 100px #FFE06644, inset 0 0 20px #FFE06644; }
        @media (max-width: 600px) { .neon-landing .cta button { padding: 16px 0; width: 80vw; text-align: center; } }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      <div className="neon-landing">
        <canvas ref={canvasRef} />
        <div className="nl-container">
          <div className="logo-wrap">
            <div className="logo" ref={logoRef}>
              {'BetAll'.split('').map((ch, i) => (
                <span key={i} className="letter">{ch}</span>
              ))}
            </div>
            <div className="burst" ref={burstRef} />
          </div>
          <div className="reflection" ref={reflectionRef}>BetAll</div>
          <div className="tagline" ref={taglineRef}>Mercado de Predicciones</div>
          <div className="cta" ref={ctaRef}>
            <button onClick={() => navigate('/register')}>Empezá a predecir</button>
          </div>
        </div>
      </div>
    </>
  );
}
