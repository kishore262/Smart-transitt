import React from 'react';

interface FooterProps {
  onCorridorSelect?: (corridor: string) => void;
  onCallSos?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onCorridorSelect, onCallSos }) => {
  return (
    <footer className="w-full bg-[#050d25] border-t border-[#2c344d]/40 py-space-xl text-on-surface-variant font-body-sm text-body-sm">
      <div className="w-full px-4 md:px-margin-desktop grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-xl">
        {/* Col 1 */}
        <div className="space-y-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-on-surface">HMUMA Command Network</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Integrated Transit Telemetry, GTFS-RT Real-time Feeds, and Multi-modal Fleet Dispatch for Greater Hyderabad.
          </p>
          <div className="font-label-caps text-label-caps text-tertiary flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            SYSTEM HEALTH: NOMINAL · RT-V2.8.4
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-space-sm">
          <div className="font-headline-sm text-headline-sm text-on-surface">Transit Corridors</div>
          <ul className="space-y-space-xs">
            <li>
              <button
                onClick={() => onCorridorSelect?.('Corridor III Blue Line')}
                className="hover:text-primary transition-colors text-left cursor-pointer"
              >
                Hyderabad Metro Rail (Red, Blue, Green Lines)
              </button>
            </li>
            <li>
              <button
                onClick={() => onCorridorSelect?.('TGSRTC 10H & 222L')}
                className="hover:text-primary transition-colors text-left cursor-pointer"
              >
                TGSRTC City Ordinary, Metro Express, & Deluxe
              </button>
            </li>
            <li>
              <button
                onClick={() => onCorridorSelect?.('Pushpak Express')}
                className="hover:text-primary transition-colors text-left cursor-pointer"
              >
                Pushpak RGIA Airport Luxury Shuttles
              </button>
            </li>
            <li>
              <button
                onClick={() => onCorridorSelect?.('MMTS Suburban Rail')}
                className="hover:text-primary transition-colors text-left cursor-pointer"
              >
                MMTS Suburban Rail Corridors
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-space-sm">
          <div className="font-headline-sm text-headline-sm text-on-surface">Command Helplines</div>
          <ul className="space-y-space-xs font-telemetry-sm text-telemetry-sm">
            <li className="flex items-center gap-1">
              <span>National Emergency:</span>
              <button onClick={onCallSos} className="text-error font-bold hover:underline cursor-pointer">
                112
              </button>
            </li>
            <li className="flex items-center gap-1">
              <span>HMR Helpline:</span>
              <a href="tel:04023332555" className="text-primary hover:underline">
                040-23332555
              </a>
            </li>
            <li className="flex items-center gap-1">
              <span>TGSRTC Support:</span>
              <a href="tel:04069440000" className="text-secondary hover:underline">
                040-69440000
              </a>
            </li>
            <li className="flex items-center gap-1">
              <span>RGIA Dispatch:</span>
              <a href="tel:04066764000" className="text-tertiary hover:underline">
                040-66764000
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div className="space-y-space-sm">
          <div className="font-headline-sm text-headline-sm text-on-surface">Civic Authority</div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Government of Telangana Urban Development & Municipal Administration Department.
          </p>
          <div className="font-label-caps text-label-caps text-outline-variant pt-2 border-t border-surface-container-high/30">
            © 2025 HMUMA. ALL CIVIC DATA INTEGRATED.
          </div>
        </div>
      </div>
    </footer>
  );
};
