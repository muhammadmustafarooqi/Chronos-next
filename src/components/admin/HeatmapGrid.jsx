import React from 'react';

export default function HeatmapGrid({ data }) {
    if (!data || data.length === 0) return <div className="text-gray-500">No configurator data available.</div>;

    const maxCount = Math.max(...data.map(d => d.count));

    const getOpacity = (count) => {
        const ratio = count / maxCount;
        return Math.max(0.2, ratio); // Base opacity 0.2
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((combo, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded border border-[#333]">
                    <div 
                        className="w-12 h-12 rounded bg-[#D4AF37] flex items-center justify-center text-black font-bold"
                        style={{ opacity: getOpacity(combo.count) }}
                    >
                        {combo.count}
                    </div>
                    <div>
                        <p className="text-white text-sm capitalize">{combo._id.dialColor} Dial</p>
                        <p className="text-gray-500 text-xs capitalize">{combo._id.caseFinish} Case · {combo._id.strap} Strap</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
