import React from 'react'

export const AnimatedBackground: React.FC = () => (
    <div
        className="fixed inset-0"
        style={{
            zIndex: -1, // Cambiado de -50 a -1 para que no quede detrás del fondo del body
            background: 'linear-gradient(180deg, #F8FAFC 0%, #E0F2FE 100%)' // Azul ligeramente más marcado al fondo
        }}
    >
        {/* Very subtle topographic SVG pattern */}
        <svg
            style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                opacity: 0.025, pointerEvents: 'none',
            }}
            viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"
        >
            {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((offset, i) => (
                <ellipse key={i} cx="600" cy={300 + offset} rx={900 - i * 70} ry={30 + i * 22} fill="none" stroke="#0F172A" strokeWidth="1" />
            ))}
            <path d="M0 700 Q200 380 400 400 Q500 250 600 180 Q700 250 800 400 Q1000 380 1200 700 Z" fill="none" stroke="#0F172A" strokeWidth="1.2" />
            <path d="M100 700 Q280 420 450 430 Q530 290 600 220 Q670 290 750 430 Q920 420 1100 700 Z" fill="none" stroke="#0F172A" strokeWidth="0.8" />
        </svg>
    </div>
)