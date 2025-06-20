"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import useIsMobile from "@/hooks/useIsMobile";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  const isMobile = useIsMobile();
  return (
    <main>
      <div
        className={cn(
          "transition-bg relative flex min-h-screen flex-col items-center justify-start bg-zinc-900 text-white",
          className
        )}
        {...props}
      >
        {/* Dark semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Aurora animation or simple gradient for mobile */}
        {isMobile ? (
          <div
            className="absolute inset-0 overflow-hidden z-0"
            style={{
              background: "linear-gradient(135deg,rgb(39, 36, 36) 0%,rgb(27, 26, 26) 50%,rgb(0, 0, 0) 100%)",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 overflow-hidden z-0"
            style={{
              "--aurora":
                "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
              "--dark-gradient":
                "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
              "--white-gradient":
                "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
              "--blue-300": "#93c5fd",
              "--blue-400": "#60a5fa",
              "--blue-500": "#3b82f6",
              "--indigo-300": "#a5b4fc",
              "--violet-200": "#ddd6fe",
              "--black": "#000",
              "--white": "#fff",
              "--transparent": "transparent",
            } as React.CSSProperties}
          >
            <div
              className={cn(
                `after:animate-aurora pointer-events-none absolute -inset-[20%] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-40 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

                showRadialGradient &&
                  `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
              )}
            ></div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 min-h-screen min-w-screen flex flex-col items-center justify-center p-0 m-0">
          {children}
        </div>
      </div>
    </main>
  );
};
