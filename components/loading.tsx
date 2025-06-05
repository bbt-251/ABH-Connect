import { Loader } from 'lucide-react';
import React from 'react'

export default function LoadingComponent() {
    return (
        <div className="flex items-center justify-center flex-1">
            <div className="max-w h-[100vh] flex items-center">
                <Loader className="animate-spin w-12 h-12 text-[#0a3141]" />
            </div>
        </div>
    );
}
