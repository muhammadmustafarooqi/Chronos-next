import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const stages = ['submitted', 'received', 'in-service', 'ready', 'returned'];

export default function ServiceTimeline({ timeline, currentStatus }) {
    const currentStageIndex = stages.indexOf(currentStatus);

    return (
        <div className="relative pt-10 pb-8 pl-8 sm:pl-0 sm:py-12">
            {/* Horizontal Line for Desktop */}
            <div className="hidden sm:block absolute top-[68px] left-10 right-10 h-0.5 bg-[#333]"></div>
            {/* Vertical Line for Mobile */}
            <div className="sm:hidden absolute left-[31px] top-10 bottom-8 w-0.5 bg-[#333]"></div>

            <div className="flex flex-col sm:flex-row justify-between relative space-y-8 sm:space-y-0 relative z-10">
                {stages.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    
                    // Find actual timeline event if it exists
                    const eventDate = timeline.find(t => t.stage === stage)?.timestamp;

                    return (
                        <div key={stage} className="flex sm:flex-col items-center sm:w-1/5 relative">
                            {/* Line fill progress (Desktop) */}
                            {index < stages.length - 1 && isCompleted && !isCurrent && (
                                <motion.div 
                                    className="hidden sm:block absolute top-7 left-[50%] right-[-50%] h-0.5 bg-[#D4AF37] z-[-1]"
                                    initial={{ scaleX: 0, transformOrigin: 'left' }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: index * 0.2 }}
                                />
                            )}
                            
                            {/* Marker */}
                            <div className="z-10 bg-[#0a0a0a] rounded-full p-2 relative flex-shrink-0 mr-4 sm:mr-0 mb-0 sm:mb-4">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                                ) : (
                                    <Circle className="w-6 h-6 text-[#444]" />
                                )}
                                {isCurrent && (
                                    <motion.div 
                                        className="absolute inset-2 rounded-full border border-[#D4AF37]"
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                )}
                            </div>

                            {/* Label & Date */}
                            <div className="sm:text-center text-left">
                                <p className={`text-sm tracking-widest uppercase font-medium ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                    {stage.replace('-', ' ')}
                                </p>
                                {eventDate && (
                                    <p className="text-xs text-gray-400 mt-1 flex items-center sm:justify-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(eventDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
