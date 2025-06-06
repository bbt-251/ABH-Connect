import { Loader } from 'lucide-react';
import React from 'react'

interface Props {
    message?: string; // Optional message prop
}

export default function LoadingComponent({ message }: Props) {
    return (
        <div className="flex items-center justify-center flex-1">
            <div className="max-w h-[100vh] flex items-center">
                <Loader className="animate-spin w-12 h-12 text-[#0a3141]" />
                {message &&
                    <span className="ml-4 text-lg text-gray-700">{message}</span>
                }
            </div>
        </div>
    );
}
