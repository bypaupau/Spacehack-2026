import React from 'react';

interface SatelliteCompareProps {
    beforeUrl?: string;
    afterUrl?: string;
    location?: string;
}

export const SatelliteCompare: React.FC<SatelliteCompareProps> = ({
                                                                      beforeUrl,
                                                                      afterUrl,
                                                                      location
                                                                  }) => {
    // Si no hay URLs, mostramos un mensaje temporal
    if (!beforeUrl || !afterUrl) {
        return (
            <div className="flex h-64 items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-400">Imágenes satelitales no disponibles para este caso.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {location && <p className="text-sm text-gray-400 font-mono">{location}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Imagen del ANTES */}
                <div className="flex flex-col rounded-lg overflow-hidden border border-gray-700">
                    <div className="bg-gray-800 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-300">
                        Antes
                    </div>
                    <img
                        src={beforeUrl}
                        alt="Satélite Antes"
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Imagen del DESPUÉS */}
                <div className="flex flex-col rounded-lg overflow-hidden border border-gray-700">
                    <div className="bg-[#5c2438] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#ff80b5]">
                        Después
                    </div>
                    <img
                        src={afterUrl}
                        alt="Satélite Después"
                        className="w-full h-auto object-cover"
                    />
                </div>
            </div>
        </div>
    );
};