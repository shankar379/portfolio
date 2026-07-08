import { useEffect, useState } from 'react';
import './LiveClock.css';

// Fixed bottom-right monospace clock — Hyderabad time, like a studio site.
const LiveClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-clock" aria-hidden="true">
      HYDERABAD, IN&ensp;{time}
    </div>
  );
};

export default LiveClock;
