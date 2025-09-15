// SkeletonCard.tsx
export default function SkeletonCard() {
    return (
        <div className="border rounded-lg p-4 animate-pulse bg-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg border" />

                    <div className="flex flex-col gap-2">
                        <div className="w-48 h-5 bg-gray-300 rounded" /> {/* Job title */}
                        <div className="flex gap-4 text-sm text-gray-400">
                            <div className="w-24 h-4 bg-gray-300 rounded" /> {/* Company */}
                            <div className="w-20 h-4 bg-gray-300 rounded" /> {/* Location */}
                            <div className="w-20 h-4 bg-gray-300 rounded" /> {/* Deadline */}
                        </div>
                    </div>
                </div>
                <div className="w-20 h-6 bg-gray-300 rounded" /> {/* Badge */}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
                <div className="w-full h-4 bg-gray-300 rounded" /> {/* Description line 1 */}
                <div className="w-full h-4 bg-gray-300 rounded" /> {/* Description line 2 */}

                <div className="w-32 h-4 bg-gray-300 rounded" /> {/* Salary */}

                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-12 h-5 bg-gray-300 rounded" /> {/* Skill */}
                        <div className="w-12 h-5 bg-gray-300 rounded" /> {/* Skill */}
                    </div>
                    <div className="w-24 h-8 bg-gray-300 rounded" /> {/* View Details button */}
                </div>
            </div>
        </div>
    );
}
